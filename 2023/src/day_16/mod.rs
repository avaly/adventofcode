use crate::vectors::Parser;

type Point = (i8, i8);
type Direction = (i8, i8);

fn direction_hash(input: Direction) -> u8 {
    match input {
        (0, 1) => 2,
        (0, -1) => 4,
        (1, 0) => 8,
        (-1, 0) => 16,
        _ => 0,
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    map: Vec<Vec<char>>,
    max_x: usize,
    max_y: usize,
}

impl Data {
    fn from(contents: &str) -> Self {
        let map = contents.to_char_grid();
        let max_x = map[0].len();
        let max_y = map.len();

        Self { map, max_x, max_y }
    }

    fn start_light(&self, position: Point, direction: Direction) -> usize {
        let mut map_raw = vec![0u8; self.max_y * self.max_x];
        let mut map_vec: Vec<_> = map_raw.as_mut_slice().chunks_mut(self.max_x).collect();
        let visited = map_vec.as_mut_slice();

        self.move_light(visited, position, direction);

        let mut result = 0;
        for y in 0..self.max_y {
            for x in 0..self.max_x {
                if visited[y][x] > 0 {
                    result += 1;
                }
            }
        }
        result
    }

    fn move_light(&self, visited: &mut [&mut [u8]], position: Point, direction: Direction) {
        if position.0 < 0 || position.0 >= self.max_y as i8 {
            return;
        }
        if position.1 < 0 || position.1 >= self.max_x as i8 {
            return;
        }

        let visited_position = visited[position.0 as usize][position.1 as usize];
        let tile = self.map[position.0 as usize][position.1 as usize];
        let dir_hash = direction_hash(direction);

        if visited_position > 0 {
            match tile {
                '-' => {
                    if (visited_position & 8 > 0 || visited_position & 16 > 0)
                        && (dir_hash & 8 > 0 || dir_hash & 16 > 0)
                    {
                        return;
                    }
                }
                '|' => {
                    if (visited_position & 2 > 0 || visited_position & 4 > 0)
                        && (dir_hash & 2 > 0 || dir_hash & 4 > 0)
                    {
                        return;
                    }
                }
                '/' => {
                    if (visited_position & 2 > 0 || visited_position & 8 > 0)
                        && (dir_hash & 2 > 0 || dir_hash & 8 > 0)
                    {
                        return;
                    }
                    if (visited_position & 4 > 0 || visited_position & 16 > 0)
                        && (dir_hash & 4 > 0 || dir_hash & 16 > 0)
                    {
                        return;
                    }
                }
                '\\' => {
                    if (visited_position & 2 > 0 || visited_position & 16 > 0)
                        && (dir_hash & 2 > 0 || dir_hash & 16 > 0)
                    {
                        return;
                    }
                    if (visited_position & 4 > 0 || visited_position & 8 > 0)
                        && (dir_hash & 4 > 0 || dir_hash & 8 > 0)
                    {
                        return;
                    }
                }
                _ => {}
            }
        }

        visited[position.0 as usize][position.1 as usize] |= direction_hash(direction);

        let next = (position.0 + direction.0, position.1 + direction.1);

        match tile {
            '.' => {
                self.move_light(visited, next, direction);
            }
            '|' => {
                if direction == (0, 1) || direction == (0, -1) {
                    self.move_light(visited, (position.0 - 1, position.1), (-1, 0));
                    self.move_light(visited, (position.0 + 1, position.1), (1, 0));
                } else {
                    self.move_light(visited, next, direction);
                }
            }
            '-' => {
                if direction == (1, 0) || direction == (-1, 0) {
                    self.move_light(visited, (position.0, position.1 - 1), (0, -1));
                    self.move_light(visited, (position.0, position.1 + 1), (0, 1));
                } else {
                    self.move_light(visited, next, direction);
                }
            }
            '/' => {
                let next_direction = match direction {
                    (0, 1) => (-1, 0),
                    (0, -1) => (1, 0),
                    (1, 0) => (0, -1),
                    (-1, 0) => (0, 1),
                    _ => (0, 0),
                };
                self.move_light(
                    visited,
                    (position.0 + next_direction.0, position.1 + next_direction.1),
                    next_direction,
                );
            }
            '\\' => {
                let next_direction = match direction {
                    (0, 1) => (1, 0),
                    (0, -1) => (-1, 0),
                    (1, 0) => (0, 1),
                    (-1, 0) => (0, -1),
                    _ => (0, 0),
                };
                self.move_light(
                    visited,
                    (position.0 + next_direction.0, position.1 + next_direction.1),
                    next_direction,
                );
            }
            _ => panic!("Unexpected"),
        }
    }
}

fn part1(data: Data) -> usize {
    data.start_light((0, 0), (0, 1))
}

fn part2(data: Data) -> usize {
    let mut max = 0;

    for x in 0..data.max_x {
        let value = data.start_light((0, x as i8), (1, 0));
        if value > max {
            max = value;
        }
    }
    for x in 0..data.max_x {
        let value = data.start_light((data.max_y as i8 - 1, x as i8), (-1, 0));
        if value > max {
            max = value;
        }
    }
    for y in 0..data.max_y {
        let value = data.start_light((y as i8, 0), (0, 1));
        if value > max {
            max = value;
        }
    }
    for y in 0..data.max_y {
        let value = data.start_light((y as i8, data.max_x as i8 - 1), (0, -1));
        if value > max {
            max = value;
        }
    }

    max
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
    #[case(include_str!("sample.txt"), 46)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 51)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
