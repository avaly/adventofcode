use std::collections::HashMap;

use regex::Regex;

#[derive(Debug, Clone, Copy, PartialEq)]
enum ModuleStyle {
    Broadcaster,
    Conjunction,
    FlipFlop,
}

type Pulse<'a> = (&'a str, &'a str, bool);

#[derive(Debug, Clone, PartialEq)]
struct Module<'a> {
    destinations: Vec<&'a str>,
    name: &'a str,
    on: bool,
    style: ModuleStyle,
}

impl<'a> Module<'a> {
    fn ready(&self, memory: &mut HashMap<&'a str, bool>) -> bool {
        match self.style {
            ModuleStyle::Broadcaster => true,
            ModuleStyle::FlipFlop => !self.on,
            ModuleStyle::Conjunction => memory.values().all(|value| !value),
        }
    }

    fn pulse(
        &mut self,
        high: bool,
        source: &'a str,
        memory: &mut HashMap<&'a str, bool>,
    ) -> Vec<Pulse<'a>> {
        let mut new_pulse = high;

        match self.style {
            ModuleStyle::FlipFlop => {
                if high {
                    return vec![];
                }

                self.on = !self.on;
                new_pulse = self.on;
            }
            ModuleStyle::Conjunction => {
                memory.insert(source, high);
                new_pulse = !memory.values().all(|value| *value);
            }
            _ => (),
        }

        let mut pulses = Vec::new();

        for destination in self.destinations.iter() {
            pulses.push((self.name, *destination, new_pulse));
        }

        pulses
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data<'a> {
    names: Vec<&'a str>,
    memory: HashMap<&'a str, HashMap<&'a str, bool>>,
    modules: HashMap<&'a str, Module<'a>>,
}

impl<'a> Data<'a> {
    fn from(contents: &'a str) -> Self {
        let mut names = Vec::new();
        let mut memory = HashMap::new();
        let mut modules = HashMap::new();

        for line in contents.lines() {
            let re_module = Regex::new("^([&%]{0,1})([a-z]+) -> (.+)$").unwrap();
            let captures = re_module.captures(line).unwrap();

            let name = captures.get(2).unwrap().as_str();
            let style = captures.get(1).unwrap().as_str();
            let style = if name == "broadcaster" {
                ModuleStyle::Broadcaster
            } else {
                if style == "%" {
                    ModuleStyle::FlipFlop
                } else if style == "&" {
                    ModuleStyle::Conjunction
                } else {
                    panic!("Unexpected type");
                }
            };

            let module = Module {
                destinations: captures.get(3).unwrap().as_str().split(", ").collect(),
                name,
                on: false,
                style,
            };

            names.push(name);
            modules.insert(name, module);
            memory.insert(name, HashMap::new());
        }
        // dbg!(&modules);

        for name in names.iter() {
            let module = modules.get(name).unwrap();
            for destination in module.destinations.iter() {
                match modules.get(destination) {
                    Some(destination_module) => {
                        if destination_module.style == ModuleStyle::Conjunction {
                            let destination_memory: &mut HashMap<&str, bool> =
                                memory.get_mut(destination).unwrap();
                            destination_memory.insert(name, false);
                        }
                    }
                    None => (),
                }
            }
        }

        Self {
            names,
            memory,
            modules,
        }
    }

    fn start_pulse(&mut self, stop: &str) -> usize {
        let mut counters: Vec<(usize, usize)> = Vec::new();

        let mut stop_grandparents: Vec<&str> = Vec::new();
        if stop != "" {
            let mut stop_parent = "";

            for name in self.names.iter() {
                let module = self.modules.get(name).unwrap();
                for destination in module.destinations.iter() {
                    if *destination == stop {
                        stop_parent = name;
                    }
                }
            }

            for name in self.names.iter() {
                let module = self.modules.get(name).unwrap();
                for destination in module.destinations.iter() {
                    if *destination == stop_parent {
                        stop_grandparents.push(name);
                    }
                }
            }
        }

        let mut pulses: Vec<Pulse> = vec![];
        let mut ready = false;
        let mut stop_pulses = 0;

        while (stop == "" && !ready) || (stop != "" && stop_pulses != 1) {
            stop_pulses = 0;
            let mut counter = (0, 0);

            pulses.push(("button", "broadcaster", false));

            while pulses.len() > 0 {
                let (source, destination, high) = pulses.remove(0);
                if high {
                    counter.1 += 1;
                } else {
                    counter.0 += 1;
                }

                // if destination == stop {
                //     if !high {
                //         println!("{} > {} {} - {}", source, destination, high, counters.len());
                //         stop_pulses += 1;
                //     }
                // }

                match self.modules.get_mut(destination) {
                    Some(module) => {
                        let next_pulses =
                            module.pulse(high, source, self.memory.get_mut(destination).unwrap());

                        for pulse in next_pulses {
                            pulses.push(pulse);
                        }
                    }
                    None => {}
                }

                // println!("Queue:");
                // for pulse in pulses.iter() {
                //     println!(
                //         "  {} > {} {}",
                //         pulse.0,
                //         pulse.1,
                //         if pulse.2 { "high" } else { "low" }
                //     );
                // }
                // println!("");
            }
            // println!("highs = {}, lows = {}", counter.1, counter.0);

            ready = true;
            for name in self.names.iter() {
                let module = self.modules.get(name).unwrap();
                ready &= module.ready(self.memory.get_mut(name).unwrap())
            }
            // println!("ready {}", ready);

            counters.push(counter);
            if counters.len() % 10000 == 0 {
                println!("runs: {}", counters.len());
            }

            if stop == "" && counters.len() == 1000 {
                break;
            }
            // dbg!(stop_pulses);

            if stop != "" {
                for grandparent in stop_grandparents.iter() {
                    let module = self.modules.get(grandparent).unwrap();
                    // println!("{} = {}", grandparent, counters.len());
                    if module.ready(self.memory.get_mut(grandparent).unwrap()) {
                        println!("{} = {}", grandparent, counters.len());
                    }
                }
            }
        }
        // dbg!(&counters);

        let cycles = 1000 / counters.len();
        let remainder = 1000 % counters.len();
        println!(
            "runs = {}, cycles = {}, remainder = {} ",
            counters.len(),
            cycles,
            remainder
        );

        let mut total = (0, 0);
        for counter in counters {
            total.0 += counter.0;
            total.1 += counter.1;
        }
        total = (total.0 * cycles, total.1 * cycles);
        println!("total * cycles = {:?} ", total);

        total.0 * total.1
    }
}

fn part1(contents: String) -> usize {
    let mut data = Data::from(contents.as_str());

    data.start_pulse("")
}

fn part2(contents: String) -> usize {
    let mut data = Data::from(contents.as_str());

    data.start_pulse("rx")
}

pub fn solve(contents: String) {
    // let data = Data::from(contents.as_str());

    // println!("Part 1: {}", part1(contents.clone()));
    println!("Part 2: {}", part2(contents));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case(include_str!("sample.txt"), 32000000)]
    #[case(include_str!("sample-2.txt"), 11687500)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(String::from(contents)), expected_value);
    }
}
