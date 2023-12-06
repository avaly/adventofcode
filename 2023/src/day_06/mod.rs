use crate::vectors::Parser;

#[derive(Debug, Clone, PartialEq)]
struct Race {
    distance: isize,
    time: isize,
}

impl Race {
    fn wins(&self) -> i32 {
        let mut result = 0i32;
        for speed in 0..=self.time {
            if self.distance < speed * (self.time - speed) {
                result += 1;
            }
        }
        return result;
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    races: Vec<Race>,
}

impl Data {
    fn from(contents: &str) -> Self {
        let lines: Vec<&str> = contents.lines().collect();

        let times = lines[0].split(':').last().unwrap().to_vec::<isize>(" ");
        let distances = lines[1].split(':').last().unwrap().to_vec::<isize>(" ");

        return Self {
            races: times
                .into_iter()
                .enumerate()
                .map(|(index, time)| Race {
                    distance: distances[index],
                    time,
                })
                .collect(),
        };
    }

    fn from_merged(contents: &str) -> Self {
        return Data::from(contents.replace(" ", "").as_str());
    }
}

fn part1(data: Data) -> i32 {
    return data
        .races
        .iter()
        .map(|race| race.wins())
        .into_iter()
        .product();
}

fn part2(data: Data) -> i32 {
    return part1(data);
}

pub fn solve(contents: String) {
    println!("Part 1: {}", part1(Data::from(contents.as_str())));
    println!("Part 2: {}", part2(Data::from_merged(contents.as_str())));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case(include_str!("sample.txt"), Data {
        races: vec![
            Race { time: 7, distance: 9 },
            Race { time: 15, distance: 40 },
            Race { time: 30, distance: 200 },
        ]
     })]
    fn test_parse_input(#[case] contents: &str, #[case] expected_value: Data) {
        assert_eq!(Data::from(contents), expected_value);
    }

    #[rstest]
    #[case(Race { time: 7, distance: 9 }, 4)]
    #[case(Race { time: 15, distance: 40 }, 8)]
    #[case(Race { time: 30, distance: 200 }, 9)]
    fn test_race(#[case] input: Race, #[case] expected_value: i32) {
        assert_eq!(input.wins(), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 288)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: i32) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 71503)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: i32) {
        assert_eq!(part2(Data::from_merged(contents)), expected_value);
    }
}
