use std::{
    cmp::{max, min},
    i64::MAX,
};

use crate::vectors::Parser;

type Range = (i64, i64);

#[derive(Debug, Clone, PartialEq)]
struct Map {
    convertors: Vec<(i64, i64, i64)>,
}

impl Map {
    fn from(input: &str) -> Self {
        return Self {
            convertors: input
                .lines()
                .into_iter()
                .skip(1)
                .map(|line| {
                    let values = line.to_vec::<i64>(" ");
                    return (values[0], values[1], values[2]);
                })
                .collect(),
        };
    }

    fn convert(&self, value: i64) -> i64 {
        let mut current = value;

        for (destination, source, size) in &self.convertors {
            if &current >= source && current <= source + size {
                current = destination + (current - source);
                break;
            }
        }

        return current;
    }

    fn convert_range(&self, mut ranges: Vec<Range>) -> Vec<Range> {
        let mut result: Vec<Range> = Vec::new();

        for (destination, source, size) in self.convertors.iter() {
            let source_range = (*source, source + size);

            let mut new_ranges: Vec<Range> = Vec::new();

            while ranges.len() > 0 {
                let range = ranges.pop().unwrap();

                // Case 1:
                // [range.0                                          range.1)
                //            [source_range.0      source_range.1)

                // Case 2:
                //                     [range.0                      range.1)
                // [source_range.0                 source_range.1)

                // Case 3:
                //                                   [range.0        range.1)
                // [source_range.0  source_range.1)

                // Case 4:
                // [range.0                         range.1)
                //              [source_range.0               source_range.1)

                // Case 5:
                // [range.0         range.1)
                //                           [source_range.0  source_range.1)

                let before = (range.0, min(source_range.0, range.1));
                let middle = (max(range.0, source_range.0), min(source_range.1, range.1));
                let after = (max(range.0, source_range.1), range.1);

                if before.0 < before.1 {
                    new_ranges.push(before);
                }
                if middle.0 < middle.1 {
                    result.push((
                        middle.0 - source + destination,
                        middle.1 - source + destination,
                    ))
                }
                if after.0 < after.1 {
                    new_ranges.push(after);
                }
            }
            ranges = new_ranges;
        }

        result.append(&mut ranges);
        return result;
    }
}

#[derive(Debug, Clone)]
struct Data {
    maps: Vec<Map>,
    seeds: Vec<i64>,
}

impl Data {
    fn convert_seed(&self, value: i64) -> i64 {
        return self.maps.iter().fold(value, |acc, map| map.convert(acc));
    }

    fn convert_range(&self, range: Range) -> Range {
        let mut ranges = vec![range];

        for map in self.maps.iter() {
            ranges = map.convert_range(ranges);
        }
        ranges.sort();

        return ranges[0];
    }
}

fn parse_input(contents: String) -> Data {
    let sections: Vec<&str> = contents.split("\n\n").collect();

    let seeds = sections
        .get(0)
        .unwrap()
        .split(": ")
        .last()
        .unwrap()
        .to_vec::<i64>(" ");

    let mut maps: Vec<Map> = Vec::new();
    for map_input in sections.split_at(1).1 {
        maps.push(Map::from(map_input));
    }

    return Data { maps, seeds };
}

fn part1(data: Data) -> i64 {
    return data
        .seeds
        .iter()
        .map(|seed| data.convert_seed(*seed))
        .min()
        .unwrap();
}

fn part2(data: Data) -> i64 {
    let mut result = MAX;

    for chunk in data.seeds.chunks(2) {
        let range = (chunk[0], chunk[0] + chunk[1]);

        result = result.min(data.convert_range(range).0);
    }

    return result;
}

pub fn solve(contents: String) {
    let data = parse_input(contents);

    println!("Part 1: {}", part1(data.clone()));

    println!("Part 2: {}", part2(data));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case("seed-to-soil map:\n50 98 2\n52 50 48", Map { convertors: vec![(50, 98, 2), (52, 50, 48)] } )]
    fn test_map_parse(#[case] input: &str, #[case] expected_value: Map) {
        assert_eq!(Map::from(input), expected_value);
    }

    #[rstest]
    #[case(10, 10)]
    #[case(49, 49)]
    #[case(50, 52)]
    #[case(51, 53)]
    #[case(79, 81)]
    #[case(97, 99)]
    #[case(98, 50)]
    #[case(99, 51)]
    fn test_map_convert(#[case] input: i64, #[case] expected_value: i64) {
        let map = Map {
            convertors: vec![(50, 98, 2), (52, 50, 48)],
        };
        assert_eq!(map.convert(input), expected_value);
    }

    #[rstest]
    #[case(79, 82)]
    #[case(14, 43)]
    #[case(55, 86)]
    #[case(13, 35)]
    fn test_data_convert_seed(#[case] input: i64, #[case] expected_value: i64) {
        assert_eq!(
            parse_input(String::from(include_str!("sample.txt"))).convert_seed(input),
            expected_value
        );
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 35)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: i64) {
        assert_eq!(part1(parse_input(String::from(contents))), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 46)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: i64) {
        assert_eq!(part2(parse_input(String::from(contents))), expected_value);
    }
}
