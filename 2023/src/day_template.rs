use crate::vectors::Parser;

#[derive(Debug, Clone, PartialEq)]
struct Data {}

impl Data {
    fn from(contents: &str) -> Self {
        Self {}
    }
}

fn part1(_data: Data) -> i64 {
    return 0;
}

fn part2(_data: Data) -> i64 {
    return 0;
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
    #[case(include_str!("sample.txt"), Data { })]
    fn test_parse_input(#[case] contents: &str, #[case] expected_value: Data) {
        assert_eq!(Data::from(contents), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 0)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: i64) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 0)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: i64) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
