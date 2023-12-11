use std::{
    cmp::{max, min},
    collections::HashMap,
};

use crate::vectors::Parser;

type Point = (usize, usize);
type Pair = (Point, Point);

#[derive(Debug, Clone, PartialEq)]
struct Data {
    expanded_y: Vec<usize>,
    expanded_x: Vec<usize>,
    items: Vec<Point>,
    map: Vec<Vec<u32>>,
    max_x: usize,
    max_y: usize,
}

impl Data {
    fn from(contents: &str) -> Self {
        let mut expanded_x = Vec::new();
        let mut expanded_y = Vec::new();
        let mut items = Vec::new();
        let mut galaxy = 0;

        let map = contents
            .to_char_grid()
            .iter()
            .map(|row| {
                row.iter()
                    .map(|cell| match cell {
                        '.' => 0,
                        '#' => {
                            galaxy += 1;
                            galaxy
                        }
                        _ => 999,
                    })
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();

        let max_x = map.get(0).unwrap().len();
        let max_y = map.len();

        for x in 0..max_x {
            let mut is_row_empty = true;
            for y in 0..max_y {
                is_row_empty &= map.get(y).unwrap().get(x).unwrap() == &0;
            }
            if is_row_empty {
                expanded_x.push(x);
            }
        }
        for y in 0..max_y {
            if map.get(y).unwrap().iter().all(|cell| cell == &0) {
                expanded_y.push(y);
            }
        }

        for y in 0..max_y {
            for x in 0..max_x {
                if map.get(y).unwrap().get(x).unwrap() != &0 {
                    items.push((y, x));
                }
            }
        }

        Self {
            expanded_x,
            expanded_y,
            items,
            map,
            max_x,
            max_y,
        }
    }

    fn find_paths(&self, source: Point, expanse: usize) -> Vec<usize> {
        self.items
            .iter()
            .map(|item| {
                if *item == source {
                    return 0;
                }

                let mut expanded = 0;

                for y in min(source.0, item.0)..max(source.0, item.0) {
                    if self.expanded_y.contains(&y) {
                        expanded += expanse - 1;
                    }
                }
                for x in min(source.1, item.1)..max(source.1, item.1) {
                    if self.expanded_x.contains(&x) {
                        expanded += expanse - 1;
                    }
                }

                item.0.abs_diff(source.0) + item.1.abs_diff(source.1) + expanded
            })
            .collect()
    }
}

fn solve_generic(data: Data, expanse: usize) -> usize {
    let mut result = 0;
    let mut distances: HashMap<Pair, usize> = HashMap::new();

    for item in data.items.iter() {
        let paths = data.find_paths(*item, expanse);

        for (index, other) in data.items.iter().enumerate() {
            if item != other && !distances.contains_key(&(*item, *other)) {
                distances.insert((*item, *other), paths[index]);
                distances.insert((*other, *item), paths[index]);
                result += paths[index];
            }
        }
    }

    result
}

fn part1(data: Data) -> usize {
    solve_generic(data, 2)
}

fn part2(data: Data) -> usize {
    solve_generic(data, 1000000)
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
    #[case(include_str!("sample2.txt"), Data {
        expanded_x: vec![1, 2, 4],
        expanded_y: vec![1],
        items: vec![(0, 3), (2, 0)],
        map: vec![
            vec![0, 0, 0, 1, 0],
            vec![0, 0, 0, 0, 0],
            vec![2, 0, 0, 0, 0]
        ],
        max_x: 5,
        max_y: 3,
    })]
    #[case(include_str!("sample.txt"), Data {
        expanded_x: vec![2, 5, 8],
        expanded_y: vec![3, 7],
        items: vec![(0, 3), (1, 7), (2, 0), (4, 6), (5, 1), (6, 9), (8, 7), (9, 0), (9, 4)] ,
        map: vec![
            vec![0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            vec![0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
            vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            vec![0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
            vec![0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
            vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            vec![0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            vec![0, 0, 0, 0, 0, 0, 0, 7, 0, 0],
            vec![8, 0, 0, 0, 9, 0, 0, 0, 0, 0]
        ],
        max_x: 10,
        max_y: 10,
    })]
    fn test_expand(#[case] contents: &str, #[case] expected_value: Data) {
        assert_eq!(Data::from(contents), expected_value);
    }

    #[rstest]
    #[case((include_str!("sample.txt"), 2, 4, 8), 9)]
    #[case((include_str!("sample.txt"), 3, 4, 8), 11)]
    #[case((include_str!("sample.txt"), 2, 0, 6), 15)]
    #[case((include_str!("sample.txt"), 2, 2, 5), 17)]
    #[case((include_str!("sample.txt"), 2, 7, 8), 5)]
    fn test_paths(#[case] input: (&str, usize, usize, usize), #[case] expected_value: usize) {
        let data = Data::from(input.0);
        assert_eq!(
            *data
                .find_paths(*data.items.get(input.2).unwrap(), input.1)
                .get(input.3)
                .unwrap(),
            expected_value
        );
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 374)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case((include_str!("sample.txt"), 10), 1030)]
    #[case((include_str!("sample.txt"), 100), 8410)]
    fn test_generic(#[case] input: (&str, usize), #[case] expected_value: usize) {
        assert_eq!(solve_generic(Data::from(input.0), input.1), expected_value);
    }
}
