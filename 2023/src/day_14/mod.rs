use crate::vectors::Parser;

type Point = (usize, usize);

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

    fn part1(&self) -> usize {
        let mut map_raw = vec!['.'; self.max_y * self.max_x];
        let mut map_vec: Vec<_> = map_raw.as_mut_slice().chunks_mut(self.max_x).collect();
        let map = map_vec.as_mut_slice();

        for y in 0..self.max_y {
            for x in 0..self.max_x {
                map[y][x] = self.map[y][x];
            }
        }

        for y in 0..self.max_y {
            for x in 0..self.max_x {
                if map[y][x] == '.' {
                    let mut next_rock_y = y;
                    while next_rock_y < self.max_y && map[next_rock_y][x] == '.' {
                        next_rock_y += 1;
                    }
                    if next_rock_y < self.max_y && map[next_rock_y][x] == 'O' {
                        map[y][x] = 'O';
                        map[next_rock_y][x] = '.';
                    }
                }
            }
        }

        let mut result = 0;

        for y in 0..self.max_y {
            for x in 0..self.max_x {
                if map[y][x] == 'O' {
                    result += self.load((y, x));
                }
            }
        }

        result
    }

    fn part2(&self) -> usize {
        let mut map_raw = vec!['.'; self.max_y * self.max_x];
        let mut map_vec: Vec<_> = map_raw.as_mut_slice().chunks_mut(self.max_x).collect();
        let map = map_vec.as_mut_slice();

        for y in 0..self.max_y {
            for x in 0..self.max_x {
                map[y][x] = self.map[y][x];
            }
        }

        let mut loads: Vec<usize> = Vec::new();

        for _ in 0..1000 {
            // North
            for y in 0..self.max_y {
                for x in 0..self.max_x {
                    if map[y][x] == '.' {
                        let mut next_rock = y;
                        while next_rock < self.max_y && map[next_rock][x] == '.' {
                            next_rock += 1;
                        }
                        if next_rock < self.max_y && map[next_rock][x] == 'O' {
                            map[y][x] = 'O';
                            map[next_rock][x] = '.';
                        }
                    }
                }
            }

            // West
            for x in 0..self.max_x {
                for y in 0..self.max_y {
                    if map[y][x] == '.' {
                        let mut next_rock = x;
                        while next_rock < self.max_x && map[y][next_rock] == '.' {
                            next_rock += 1;
                        }
                        if next_rock < self.max_x && map[y][next_rock] == 'O' {
                            map[y][x] = 'O';
                            map[y][next_rock] = '.';
                        }
                    }
                }
            }

            // South
            for yy in 0..self.max_y {
                let y = self.max_y - 1 - yy;
                for x in 0..self.max_x {
                    if map[y][x] == '.' {
                        let mut next_rock = y;
                        while next_rock > 0 && map[next_rock][x] == '.' {
                            next_rock -= 1;
                        }
                        if map[next_rock][x] == 'O' {
                            map[y][x] = 'O';
                            map[next_rock][x] = '.';
                        }
                    }
                }
            }

            // East
            for xx in 0..self.max_x {
                let x = self.max_x - 1 - xx;
                for y in 0..self.max_y {
                    if map[y][x] == '.' {
                        let mut next_rock = x;
                        while next_rock > 0 && map[y][next_rock] == '.' {
                            next_rock -= 1;
                        }
                        if map[y][next_rock] == 'O' {
                            map[y][x] = 'O';
                            map[y][next_rock] = '.';
                        }
                    }
                }
            }

            let mut load = 0;

            for y in 0..self.max_y {
                for x in 0..self.max_x {
                    if map[y][x] == 'O' {
                        load += self.load((y, x));
                    }
                }
            }

            loads.push(load);
        }

        let (loop_values, loop_index) = find_loop(loads);

        loop_values[(1000000000 - loop_index - 1) % loop_values.len()]
    }

    fn load(&self, rock: Point) -> usize {
        self.max_y - rock.0
    }
}

fn find_loop(list: Vec<usize>) -> (Vec<usize>, usize) {
    let mut result = Vec::new();
    let length = list.len();

    for i in 0..length {
        for j in i + 1..length {
            if list[j] == list[i] && j > i + 1 {
                let mut is_loop = true;
                let loop_size = j - i;

                for k in 0..loop_size {
                    if j + k > length - 1 {
                        is_loop = false;
                    } else {
                        is_loop &= list[i + k] == list[j + k];
                    }
                }

                // check one more loop
                if is_loop {
                    for k in 0..loop_size {
                        if j + loop_size + k > length - 1 {
                            is_loop = false;
                        } else {
                            is_loop &= list[i + k] == list[j + loop_size + k];
                        }
                    }
                }

                if is_loop {
                    for k in 0..loop_size {
                        result.push(list[i + k]);
                    }
                    return (result, i);
                }
            }
        }
    }

    (result, 0)
}

fn part1(data: Data) -> usize {
    data.part1()
}

fn part2(data: Data) -> usize {
    data.part2()
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
    #[case(vec![87, 69, 69, 69, 65, 64, 65, 63, 68, 69, 69, 65, 64, 65, 63, 68, 69, 69, 65, 64, 65, 63, 68, 69, 69, 65, 64, 65, 63, 68], (vec![69, 69, 65, 64, 65, 63, 68], 2))]
    fn test_find_loop(#[case] input: Vec<usize>, #[case] expected_value: (Vec<usize>, usize)) {
        assert_eq!(find_loop(input), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 136)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 64)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
