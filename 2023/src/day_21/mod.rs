use crate::{structs::Coordinate, vectors::Parser};

#[derive(Debug, Clone, PartialEq)]
struct Data {
    map: Vec<Vec<char>>,
    max_x: usize,
    max_y: usize,
    start: Coordinate,
}

impl Data {
    fn from(contents: &str) -> Self {
        let map = contents.to_char_grid();
        let max_x = map[0].len();
        let max_y = map.len();
        let mut start = Coordinate { y: 0, x: 0 };

        for y in 0..max_y {
            for x in 0..max_x {
                if map[y][x] == 'S' {
                    start = Coordinate { y, x };
                }
            }
        }

        Self {
            map,
            max_x,
            max_y,
            start,
        }
    }

    fn steps(&self, max_steps: usize) -> usize {
        let mut queue: Vec<Coordinate> = vec![self.start];

        for _step in 1..=max_steps {
            // println!("Step: {}", step);

            let steps_count = queue.len();

            for _ in 1..=steps_count {
                let coord = queue.remove(0);
                let neighbors = coord.neighbors(self.max_y, self.max_x, false, true);
                for neighbor in neighbors {
                    if self.map[neighbor.y][neighbor.x] != '#' && !queue.contains(&neighbor) {
                        queue.push(neighbor);
                    }
                }
            }

            // println!("Queue:");
            // for item in queue.iter() {
            //     println!("- {}", item);
            // }
            // println!("");
        }

        queue.len()
    }
}

fn part1(data: Data) -> usize {
    data.steps(64)
}

fn part2(data: Data) -> usize {
    data.steps(26501365)
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
    #[case((include_str!("sample.txt"), 6), 16)]
    // #[case((include_str!("sample.txt"), 10), 50)]
    // #[case((include_str!("sample.txt"), 50), 1594)]
    fn test_part1(#[case] input: (&str, usize), #[case] expected_value: usize) {
        assert_eq!(Data::from(input.0).steps(input.1), expected_value);
    }

    // #[rstest]
    // #[case(include_str!("sample.txt"), 0)]
    // fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
    //     assert_eq!(part2(Data::from(contents)), expected_value);
    // }
}
