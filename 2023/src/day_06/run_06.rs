use crate::file::read_file_body;

#[derive(Clone)]
struct Data {
    value: String,
}

fn parse_input(contents: String) -> Data {
    let mut data = Data {
        value: String::from(""),
    };

    let lines = contents.lines();

    return data;
}

fn part1(data: Data) -> i32 {
    let mut result = 0;

    return result;
}

fn part2(data: Data) -> i32 {
    let mut result = 0;

    return result;
}

pub fn main(input: &str) {
    let contents = read_file_body(input);
    let data = parse_input(contents);

    println!("Part 1: {}", part1(data.clone()));

    println!("Part 2: {}", part2(data));
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case(include_str!("sample.txt"), 0)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: i32) {
        assert_eq!(part1(parse_input(String::from(contents))), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 0)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: i32) {
        assert_eq!(part2(parse_input(String::from(contents))), expected_value);
    }
}
