use std::collections::HashSet;

const SIZE: usize = 140;

fn parse_input(contents: String) -> Vec<Vec<i32>> {
    let mut data = vec![vec![0; SIZE]; SIZE];

    let lines = contents.lines();
    for (y, line) in lines.enumerate() {
        let chars = line.chars().collect::<Vec<char>>();
        let mut x = 0;
        loop {
            if x >= chars.len() {
                break;
            }
            match chars.get(x).unwrap() {
                '.' => (),
                '+' => data[y][x] = -1,
                '-' => data[y][x] = -2,
                '*' => data[y][x] = -3,
                '/' => data[y][x] = -4,
                '=' => data[y][x] = -5,
                '$' => data[y][x] = -6,
                '#' => data[y][x] = -7,
                '&' => data[y][x] = -8,
                '%' => data[y][x] = -9,
                '@' => data[y][x] = -10,
                _ => {
                    let mut end = x;
                    while end < line.len() && chars.get(end).unwrap().is_digit(10) {
                        end += 1;
                    }

                    let size = end - x;
                    let value = &line[x..end];
                    let number = value.parse::<i32>().unwrap();

                    end -= 1;
                    while end >= x {
                        data[y][end] = number;
                        if end > 0 {
                            end -= 1;
                        } else {
                            break;
                        }
                    }

                    x += size;
                    continue;
                }
            }
            x += 1;
        }
    }

    return data;
}

fn get_value(data: &Vec<Vec<i32>>, y: usize, x: usize) -> Option<i32> {
    if y >= data.len() {
        return None;
    }
    if x >= data[0].len() {
        return None;
    }
    return Some(data[y][x]);
}

fn get_neighbors(data: &Vec<Vec<i32>>, y: usize, x: usize) -> HashSet<i32> {
    let mut numbers = HashSet::new();

    for yy in [y - 1, y, y + 1] {
        for xx in [x - 1, x, x + 1] {
            if y == yy && x == xx {
                continue;
            }
            match get_value(data, yy, xx) {
                Some(value) => {
                    if value > 0 {
                        numbers.insert(value);
                    }
                }
                None => continue,
            }
        }
    }

    return numbers;
}

fn part1(data: Vec<Vec<i32>>) -> i32 {
    let mut result = 0;

    for (y, line) in data.iter().enumerate() {
        for (x, value) in line.iter().enumerate() {
            if value < &0 {
                for neighbor in get_neighbors(&data, y, x).iter() {
                    result += neighbor;
                }
            }
        }
    }

    return result;
}

fn part2(data: Vec<Vec<i32>>) -> i32 {
    let mut result = 0;

    for (y, line) in data.iter().enumerate() {
        for (x, value) in line.iter().enumerate() {
            if value == &-3 {
                let neighbors = get_neighbors(&data, y, x);
                if neighbors.len() > 1 {
                    let mut ratio = 1;
                    for neighbor in neighbors.iter() {
                        ratio *= neighbor;
                    }
                    result += ratio;
                }
            }
        }
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
    #[case(include_str!("sample.txt"), 4361)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: i32) {
        let data = parse_input(String::from(contents));
        assert_eq!(part1(data), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 467835)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: i32) {
        let data = parse_input(String::from(contents));
        assert_eq!(part2(data), expected_value);
    }
}
