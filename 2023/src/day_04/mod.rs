use std::collections::HashSet;

use crate::file::read_file_body;

#[derive(Debug)]
#[derive(Clone)]
struct Card {
    numbers: Vec<u8>,
    winners: HashSet<u8>,
}

impl Card {
    fn from(input: &str) -> Self {
        let parts: Vec<&str> = input.split(": ").collect();

        let all_numbers: Vec<&str> = parts.get(1).unwrap().split(" | ").collect();

        let mut winners = HashSet::new();

        all_numbers.get(0).unwrap().split_ascii_whitespace().map(|item| item.parse::<u8>().unwrap()).for_each(|item| { winners.insert(item); });

        return Self {
            numbers: all_numbers.get(1).unwrap().split_ascii_whitespace().map(|item| item.parse::<u8>().unwrap()).collect(),
            winners,
        };
    }

    fn copies(&self) -> usize {
        let mut result = 0;

        for number in self.numbers.iter() {
            if self.winners.contains(number) {
                result += 1;
            }
        }

        return result;
    }

    fn value(&self) -> usize {
        let mut result = 0;

        for number in self.numbers.iter() {
            if self.winners.contains(number) {
                result = if result == 0 { 1 } else { result * 2 };
            }
        }

        return result;
    }
}

#[derive(Debug)]
#[derive(Clone)]
struct Data {
    cards: Vec<Card>,
}

fn parse_input(contents: &str) -> Data {
    let mut data = Data {
        cards: Vec::new(),
    };

    let lines = contents.lines();
    for line in lines {
        data.cards.push(Card::from(line));
    }

    return data;
}

fn part1(data: Data) -> usize {
    return data.cards.iter().map(|card| card.value()).sum::<usize>();
}

fn part2(data: Data) -> i32 {
    let mut totals = vec![1; data.cards.len()];

    for (index, card) in data.cards.iter().enumerate() {
        let copies = card.copies();

        for copy in 1..=copies {
            totals[index + copy] += totals[index];
        }
    }

    return totals.iter().sum();
}

pub fn main(input: &str) {
    let contents = read_file_body(input);
    let data = parse_input(contents.as_str());

    println!("Part 1: {}", part1(data.clone()));

    println!("Part 2: {}", part2(data));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case("Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53", 8)]
    #[case("Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19", 2)]
    #[case("Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11", 0)]
    fn test_foo(#[case] line: &str, #[case] expected_value: usize) {
        assert_eq!(Card::from(line).value(), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 13)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(parse_input(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 30)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: i32) {
        assert_eq!(part2(parse_input(contents)), expected_value);
    }
}
