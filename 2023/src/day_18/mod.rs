use regex::Regex;

use crate::structs::{Coordinate, Direction};

const SIZE: usize = 1000000000;

#[derive(Debug, Clone, PartialEq)]
struct Step {
    dir: Direction,
    length: usize,
}

impl Step {
    fn from_chars(input: &str) -> Self {
        let re_step = Regex::new(r"^([RLDU]) (\d+)").unwrap();
        let captures = re_step.captures(input).unwrap();

        Self {
            dir: match captures.get(1).unwrap().as_str() {
                "L" => Direction::West,
                "R" => Direction::East,
                "D" => Direction::South,
                "U" => Direction::North,
                _ => Direction::None,
            },
            length: captures.get(2).unwrap().as_str().parse().unwrap(),
        }
    }

    fn from_hex(input: &str) -> Self {
        let re_step = Regex::new(r"\(#(.{5})(.)\)$").unwrap();
        let captures = re_step.captures(input).unwrap();

        let hex = captures.get(1).unwrap().as_str();

        Self {
            dir: match captures.get(2).unwrap().as_str() {
                "0" => Direction::East,
                "1" => Direction::South,
                "2" => Direction::West,
                "3" => Direction::North,
                _ => Direction::None,
            },
            length: usize::from_str_radix(hex, 16).unwrap(),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    steps: Vec<Step>,
}

impl Data {
    fn from_chars(contents: &str) -> Self {
        Self {
            steps: contents.lines().map(Step::from_chars).collect(),
        }
    }

    fn from_hex(contents: &str) -> Self {
        Self {
            steps: contents.lines().map(Step::from_hex).collect(),
        }
    }

    fn solve(&self) -> isize {
        let mut current = Coordinate {
            x: SIZE / 2,
            y: SIZE / 2,
        };
        let mut nodes: Vec<Coordinate> = vec![];
        let mut perimeter = 0isize;

        for step in self.steps.iter() {
            for _ in 0..step.length {
                current = current.neighbor(&step.dir, SIZE, SIZE, false).unwrap();
            }
            nodes.push(current);
            perimeter += step.length as isize;
        }

        nodes.push(nodes[0]);

        let area = nodes
            .windows(2)
            .map(|pair| {
                let node_j = pair[0];
                let node_i = pair[1];

                (node_j.x * node_i.y) as isize - (node_i.x * node_j.y) as isize
            })
            .sum::<isize>();

        area / 2 + perimeter / 2 + 1
    }
}

fn part1(data: Data) -> isize {
    data.solve()
}

fn part2(data: Data) -> isize {
    data.solve()
}

pub fn solve(contents: String) {
    println!("Part 1: {}", part1(Data::from_chars(contents.as_str())));
    println!("Part 2: {}", part2(Data::from_hex(contents.as_str())));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case("R 6 (#70c710)", Step { dir: Direction::East, length: 6 })]
    #[case("D 5 (#0dc571)", Step { dir: Direction::South, length: 5 })]
    fn test_parse_chars(#[case] contents: &str, #[case] expected_value: Step) {
        assert_eq!(Step::from_chars(contents), expected_value);
    }

    #[rstest]
    #[case("R 6 (#70c710)", Step { dir: Direction::East, length: 461937 })]
    #[case("D 5 (#0dc571)", Step { dir: Direction::South, length: 56407 })]
    fn test_parse_hex(#[case] contents: &str, #[case] expected_value: Step) {
        assert_eq!(Step::from_hex(contents), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 62)]
    #[case(include_str!("sample-2.txt"), 36)]
    #[case(include_str!("sample-3.txt"), 12)]
    #[case(include_str!("sample-4.txt"), 4)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: isize) {
        assert_eq!(part1(Data::from_chars(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 952408144115)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: isize) {
        assert_eq!(part2(Data::from_hex(contents)), expected_value);
    }
}
