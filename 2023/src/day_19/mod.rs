use core::fmt;
use std::{collections::HashMap, fmt::Display};

use regex::Regex;

const MAX: usize = 4000;

#[derive(Debug, Clone, PartialEq)]
struct Part {
    x: usize,
    m: usize,
    a: usize,
    s: usize,
}

impl Part {
    fn from(input: &str) -> Self {
        let re_part = Regex::new(r"^\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}$").unwrap();
        let captures = re_part.captures(input).unwrap();

        Self {
            x: captures.get(1).unwrap().as_str().parse().unwrap(),
            m: captures.get(2).unwrap().as_str().parse().unwrap(),
            a: captures.get(3).unwrap().as_str().parse().unwrap(),
            s: captures.get(4).unwrap().as_str().parse().unwrap(),
        }
    }

    fn from_rules(rules: Vec<Rule>) -> Self {
        let mut map = vec![vec![1; MAX]; 4];

        for rule in rules {
            let index = match rule.field {
                'x' => 0,
                'm' => 1,
                'a' => 2,
                's' => 3,
                _ => MAX,
            };
            if index < MAX {
                let range = if rule.larger {
                    0..rule.value
                } else {
                    rule.value - 1..MAX
                };

                for j in range {
                    map[index][j] = 0;
                }
            }
        }

        let totals = map
            .iter()
            .map(|values| values.iter().sum())
            .collect::<Vec<_>>();

        Self {
            x: totals[0],
            m: totals[1],
            a: totals[2],
            s: totals[3],
        }
    }

    fn combinations(&self) -> usize {
        self.x * self.m * self.a * self.s
    }
}

impl Display for Part {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{},{},{},{}", self.x, self.m, self.a, self.s,)
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Rule {
    field: char,
    larger: bool,
    value: usize,
    next: String,
}

impl Rule {
    fn from(input: &str) -> Self {
        let re_rule = Regex::new(r"^(([xmas])([><])(\d+):)?([a-z\dAR]+)$").unwrap();
        let captures = re_rule.captures(input).unwrap();

        Self {
            field: match captures.get(2) {
                Some(matched) => {
                    let chars = matched.as_str().chars().collect::<Vec<_>>();
                    chars[0]
                }
                None => ' ',
            },
            larger: match captures.get(3) {
                Some(matched) => match matched.as_str() {
                    ">" => true,
                    _ => false,
                },
                None => false,
            },
            value: match captures.get(4) {
                Some(matched) if matched.as_str().len() > 0 => matched.as_str().parse().unwrap(),

                _ => 0,
            },
            next: String::from(captures.get(5).unwrap().as_str()),
        }
    }

    fn clone_simple(&self) -> Self {
        Self {
            field: self.field,
            larger: self.larger,
            value: self.value,
            next: String::from(""),
        }
    }

    fn decide(&self, part: &Part) -> Option<String> {
        let pass = match self.field {
            'x' => {
                if self.larger {
                    part.x > self.value
                } else {
                    part.x < self.value
                }
            }
            'm' => {
                if self.larger {
                    part.m > self.value
                } else {
                    part.m < self.value
                }
            }
            'a' => {
                if self.larger {
                    part.a > self.value
                } else {
                    part.a < self.value
                }
            }
            's' => {
                if self.larger {
                    part.s > self.value
                } else {
                    part.s < self.value
                }
            }
            _ => true,
        };

        if pass {
            Some(self.next.clone())
        } else {
            None
        }
    }

    fn opposite(&self) -> Self {
        Self {
            field: self.field,
            larger: !self.larger,
            value: if self.larger {
                self.value + 1
            } else {
                self.value - 1
            },
            next: String::from(""),
        }
    }
}

impl Display for Rule {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if self.field == ' ' {
            write!(f, "ALL => {}", self.next)
        } else if self.next.len() > 0 {
            write!(
                f,
                "{} {} {} => {}",
                self.field,
                if self.larger { '>' } else { '<' },
                self.value,
                self.next
            )
        } else {
            write!(
                f,
                "{} {} {}",
                self.field,
                if self.larger { '>' } else { '<' },
                self.value
            )
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Workflow {
    name: String,
    rules: Vec<Rule>,
}

impl Workflow {
    fn from(input: &str) -> Self {
        let re_workflow = Regex::new(r"^(.+)\{(.+)\}$").unwrap();
        let captures = re_workflow.captures(input).unwrap();

        Self {
            name: String::from(captures.get(1).unwrap().as_str()),
            rules: captures
                .get(2)
                .unwrap()
                .as_str()
                .split(",")
                .map(Rule::from)
                .collect(),
        }
    }

    fn process(&self, part: &Part) -> String {
        for rule in self.rules.iter() {
            match rule.decide(part) {
                Some(value) => {
                    return value.clone();
                }
                None => continue,
            }
        }
        panic!("Unexpected process");
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    parts: Vec<Part>,
    workflows: HashMap<String, Workflow>,
}

impl Data {
    fn from(contents: &str) -> Self {
        let contents_split = contents.split("\n\n").collect::<Vec<_>>();

        let mut workflows = HashMap::new();

        for line in contents_split[0].split("\n") {
            let workflow = Workflow::from(line);
            workflows.insert(workflow.name.clone(), workflow);
        }

        Self {
            parts: contents_split[1]
                .trim()
                .split("\n")
                .map(Part::from)
                .collect(),
            workflows,
        }
    }

    fn move_parts(&self) -> Vec<Part> {
        let mut accepted = vec![];

        for part in self.parts.iter() {
            let mut workflow = self.workflows.get("in").unwrap();
            let mut workflow_result = workflow.process(part);

            while workflow_result != "A" && workflow_result != "R" {
                workflow = self.workflows.get(&workflow_result).unwrap();
                workflow_result = workflow.process(part);
            }

            if workflow_result == "A" {
                accepted.push(part.clone());
            }
        }

        accepted
    }

    fn compute(&self, workflow: &Workflow, rules: Vec<Rule>) -> usize {
        let mut result = 0;
        let mut step_rules = rules.clone();

        for rule in workflow.rules.iter() {
            if rule.field != ' ' {
                step_rules.push(rule.clone_simple());
            }

            if rule.next == "A" {
                result += Part::from_rules(step_rules.clone()).combinations();
            } else if rule.next != "R" {
                result += self.compute(self.workflows.get(&rule.next).unwrap(), step_rules.clone());
            }

            if rule.field != ' ' {
                step_rules.pop();
                step_rules.push(rule.opposite());
            }
        }

        result
    }
}

fn part1(data: Data) -> usize {
    let parts = data.move_parts();

    parts
        .iter()
        .map(|part| part.x + part.m + part.a + part.s)
        .sum()
}

fn part2(data: Data) -> usize {
    data.compute(data.workflows.get("in").unwrap(), vec![])
}

pub fn solve(contents: String) {
    let data = Data::from(contents.as_str());

    println!("Part 1: {}", part1(data.clone()));
    println!("Part 2: {}", part2(data));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case("{x=787,m=2655,a=1222,s=2876}", Part { x: 787, m: 2655, a: 1222, s: 2876 })]
    #[case("{x=1679,m=44,a=2067,s=496}", Part { x: 1679, m: 44, a: 2067, s: 496 })]
    fn test_parse_part(#[case] contents: &str, #[case] expected_value: Part) {
        assert_eq!(Part::from(contents), expected_value);
    }

    #[rstest]
    #[case("foo{x<1000:bar,m>2000:ham}", Part { x: 999, m: 2000, a: 4000, s: 4000 })]
    #[case("foo{x<1000:bar,m>2000:ham,x>500:baz}", Part { x: 499, m: 2000, a: 4000, s: 4000 })]
    #[case("foo{x<1000:bar,x>2000:ham}", Part { x: 0, m: 4000, a: 4000, s: 4000 })]
    fn test_part_from_rules(#[case] contents: &str, #[case] expected_value: Part) {
        assert_eq!(
            Part::from_rules(Workflow::from(contents).rules),
            expected_value
        );
    }

    #[rstest]
    #[case("{x=0,m=1,a=1,s=1}", 0)]
    #[case("{x=1,m=1,a=1,s=1}", 1)]
    #[case("{x=1000,m=1,a=1,s=1}", 1000)]
    #[case("{x=2000,m=1,a=1,s=1}", 2000)]
    #[case("{x=3000,m=1,a=1,s=1}", 3000)]
    #[case("{x=4000,m=1,a=1,s=1}", 4000)]
    #[case("{x=4000,m=4000,a=1,s=1}", 16000000)]
    #[case("{x=4000,m=4000,a=4000,s=1}", 64000000000)]
    #[case("{x=4000,m=4000,a=4000,s=1000}", 64000000000000)]
    #[case("{x=4000,m=4000,a=4000,s=2000}", 128000000000000)]
    #[case("{x=4000,m=4000,a=4000,s=4000}", 256000000000000)]
    fn test_part_combinations(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(Part::from(contents).combinations(), expected_value);
    }

    #[rstest]
    #[case("a<2006:qkq", Rule { field: 'a', larger: false, value: 2006, next: String::from("qkq") })]
    #[case("m>1548:A", Rule { field: 'm', larger: true, value: 1548, next: String::from("A") })]
    #[case("R", Rule { field: ' ', larger: false, value: 0, next: String::from("R") })]
    fn test_parse_rule(#[case] contents: &str, #[case] expected_value: Rule) {
        assert_eq!(Rule::from(contents), expected_value);
    }

    #[rstest]
    #[case("a<1000:a", Rule { field: 'a', larger: true, value: 999, next: String::from("") })]
    #[case("x>2500:b", Rule { field: 'x', larger: false, value: 2501, next: String::from("") })]
    fn test_rule_opposite(#[case] contents: &str, #[case] expected_value: Rule) {
        assert_eq!(Rule::from(contents).opposite(), expected_value);
    }

    #[rstest]
    #[case(("a<2006:qkq", "{x=787,m=2655,a=1222,s=2876}"), Some(String::from("qkq")))]
    #[case(("a<2006:qkq", "{x=787,m=2655,a=3000,s=2876}"), None)]
    #[case(("A", "{x=787,m=2655,a=3000,s=2876}"), Some(String::from("A")))]
    fn test_rule_decide(#[case] input: (&str, &str), #[case] expected_value: Option<String>) {
        assert_eq!(
            Rule::from(input.0).decide(&Part::from(input.1)),
            expected_value
        );
    }

    #[rstest]
    #[case("px{a<2006:qkq,m>2090:A,rfg}", Workflow {
        name: String::from("px"),
        rules: vec![
            Rule { field: 'a', larger: false, value: 2006, next: String::from("qkq") },
            Rule { field: 'm', larger: true, value: 2090, next: String::from("A") },
            Rule { field: ' ', larger: false, value: 0, next: String::from("rfg") },
        ]
    })]
    #[case("lnx{m>1548:A,A}", Workflow {
        name: String::from("lnx"),
        rules: vec![
            Rule { field: 'm', larger: true, value: 1548, next: String::from("A") },
            Rule { field: ' ', larger: false, value: 0, next: String::from("A") },
        ]
    })]
    fn test_parse_workflow(#[case] contents: &str, #[case] expected_value: Workflow) {
        assert_eq!(Workflow::from(contents), expected_value);
    }

    #[rstest]
    #[case(("px{a<2006:qkq,m>2090:A,rfg}", "{x=787,m=2655,a=1222,s=2876}"), String::from("qkq"))]
    #[case(("px{a>2000:qkq,m>2090:A,rfg}", "{x=787,m=2655,a=1222,s=2876}"), String::from("A"))]
    #[case(("px{a>2000:qkq,m>3090:A,rfg}", "{x=787,m=2655,a=1222,s=2876}"), String::from("rfg"))]
    fn test_workflow_process(#[case] input: (&str, &str), #[case] expected_value: String) {
        assert_eq!(
            Workflow::from(input.0).process(&Part::from(input.1)),
            expected_value
        );
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 19114)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 167409079868000)]
    #[case(include_str!("sample-1.txt"), 35896635000000)]
    #[case(include_str!("sample-2.txt"), 31996000)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
