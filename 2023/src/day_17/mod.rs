use std::{collections::HashSet, usize::MAX};

use crate::{
    structs::{Direction, Point},
    vectors::Parser,
};

#[derive(Debug, Clone, Eq, Hash, PartialEq)]
struct Item {
    cost: usize,
    dir: Direction,
    point: Point,
    straight: u8,
}

impl Item {
    fn empty() -> Self {
        Self {
            cost: 0,
            dir: Direction::None,
            point: (0, 0),
            straight: 0,
        }
    }

    fn clone_left(&self) -> Self {
        Self {
            cost: 0,
            dir: match self.dir {
                Direction::North => Direction::West,
                Direction::South => Direction::East,
                Direction::West => Direction::South,
                Direction::East => Direction::North,
                Direction::None => Direction::None,
            },
            point: match self.dir {
                Direction::North => (self.point.0, self.point.1 - 1),
                Direction::South => (self.point.0, self.point.1 + 1),
                Direction::West => (self.point.0 + 1, self.point.1),
                Direction::East => (self.point.0 - 1, self.point.1),
                Direction::None => self.point,
            },
            straight: 1,
        }
    }

    fn clone_right(&self) -> Self {
        Self {
            cost: 0,
            dir: match self.dir {
                Direction::North => Direction::East,
                Direction::South => Direction::West,
                Direction::West => Direction::North,
                Direction::East => Direction::South,
                Direction::None => Direction::None,
            },
            point: match self.dir {
                Direction::North => (self.point.0, self.point.1 + 1),
                Direction::South => (self.point.0, self.point.1 - 1),
                Direction::West => (self.point.0 - 1, self.point.1),
                Direction::East => (self.point.0 + 1, self.point.1),
                Direction::None => self.point,
            },
            straight: 1,
        }
    }

    fn clone_straight(&self) -> Self {
        Self {
            cost: 0,
            dir: self.dir,
            point: match self.dir {
                Direction::North => (self.point.0 - 1, self.point.1),
                Direction::South => (self.point.0 + 1, self.point.1),
                Direction::West => (self.point.0, self.point.1 - 1),
                Direction::East => (self.point.0, self.point.1 + 1),
                Direction::None => self.point,
            },
            straight: self.straight + 1,
        }
    }

    fn clone_with_cost(&self, cost: usize) -> Self {
        let mut result = self.clone();
        result.cost = cost;
        result
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    map: Vec<Vec<u32>>,
    max_x: usize,
    max_y: usize,
}

impl Data {
    fn from(contents: &str) -> Self {
        let map = contents.to_int_grid();
        let max_x = map[0].len();
        let max_y = map.len();

        // dbg_matrix_as_vec(&map);

        Self { map, max_x, max_y }
    }

    fn find_shortest_path(
        &self,
        source: Point,
        destination: Point,
        min_before_turning: u8,
        max_straight: u8,
    ) -> usize {
        let mut cost_raw = vec![MAX; self.max_y * self.max_x];
        let mut cost_vec: Vec<_> = cost_raw.as_mut_slice().chunks_mut(self.max_x).collect();
        let cost = cost_vec.as_mut_slice();

        let mut queue: Vec<Item> = Vec::new();
        let mut seen: HashSet<Item> = HashSet::new();

        cost[source.0][source.1] = 0;

        queue.push(Item {
            cost: 0,
            dir: Direction::East,
            point: source,
            straight: 1,
        });
        queue.push(Item {
            cost: 0,
            dir: Direction::South,
            point: source,
            straight: 1,
        });

        while queue.len() > 0 {
            let mut min_cost = MAX;
            let mut min_index = MAX;
            let mut current: Item = Item::empty();

            for (index, item) in queue.iter().enumerate() {
                if item.cost < min_cost {
                    min_cost = item.cost;
                    min_index = index;
                    current = item.clone();
                }
            }

            if min_cost == MAX {
                panic!("Unexpected min_cost");
            }

            queue.remove(min_index);
            seen.insert(current.clone_with_cost(0));

            let mut neighbors: HashSet<Item> = HashSet::new();

            match current.dir {
                Direction::None => {}
                Direction::North => {
                    // left
                    if current.straight >= min_before_turning && current.point.1 > 0 {
                        neighbors.insert(current.clone_left());
                    }
                    // right
                    if current.straight >= min_before_turning && current.point.1 < self.max_x - 1 {
                        neighbors.insert(current.clone_right());
                    }
                    // straight
                    if current.straight < max_straight && current.point.0 > 0 {
                        neighbors.insert(current.clone_straight());
                    }
                }
                Direction::South => {
                    // left
                    if current.straight >= min_before_turning && current.point.1 < self.max_x - 1 {
                        neighbors.insert(current.clone_left());
                    }
                    // right
                    if current.straight >= min_before_turning && current.point.1 > 0 {
                        neighbors.insert(current.clone_right());
                    }
                    // straight
                    if current.straight < max_straight && current.point.0 < self.max_y - 1 {
                        neighbors.insert(current.clone_straight());
                    }
                }
                Direction::West => {
                    // left
                    if current.straight >= min_before_turning && current.point.0 < self.max_y - 1 {
                        neighbors.insert(current.clone_left());
                    }
                    // right
                    if current.straight >= min_before_turning && current.point.0 > 0 {
                        neighbors.insert(current.clone_right());
                    }
                    // straight
                    if current.straight < max_straight && current.point.1 > 0 {
                        neighbors.insert(current.clone_straight());
                    }
                }
                Direction::East => {
                    // left
                    if current.straight >= min_before_turning && current.point.0 > 0 {
                        neighbors.insert(current.clone_left());
                    }
                    // right
                    if current.straight >= min_before_turning && current.point.0 < self.max_y - 1 {
                        neighbors.insert(current.clone_right());
                    }
                    // straight
                    if current.straight < max_straight && current.point.1 < self.max_x - 1 {
                        neighbors.insert(current.clone_straight());
                    }
                }
            }

            for neighbor in neighbors {
                let neighbor_cost =
                    current.cost + self.map[neighbor.point.0][neighbor.point.1] as usize;

                let neighbor_exists = queue.iter().any(|item| {
                    item.point == neighbor.point
                        && item.dir == neighbor.dir
                        && item.straight == neighbor.straight
                });
                if !seen.contains(&&neighbor.clone_with_cost(0)) && !neighbor_exists {
                    queue.push(neighbor.clone_with_cost(neighbor_cost));
                }

                if neighbor_cost < cost[neighbor.point.0][neighbor.point.1]
                    && neighbor.straight >= min_before_turning
                {
                    cost[neighbor.point.0][neighbor.point.1] = neighbor_cost;
                }
            }
        }

        cost[destination.0][destination.1]
    }
}

fn part1(data: Data) -> usize {
    data.find_shortest_path((0, 0), (data.max_y - 1, data.max_x - 1), 0, 3)
}

fn part2(data: Data) -> usize {
    data.find_shortest_path((0, 0), (data.max_y - 1, data.max_x - 1), 4, 10)
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
    #[case(include_str!("sample.txt"), 102)]
    #[case(include_str!("sample-2.txt"), 7)]
    #[case(include_str!("sample-3.txt"), 9)]
    #[case(include_str!("sample-4.txt"), 14)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 94)]
    #[case(include_str!("sample-5.txt"), 71)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
