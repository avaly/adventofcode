use rstest::*;

use crate::file::read_file_lines;

const DIGITS_LETTERS: [&str; 9] = [
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
];

fn part1(lines: Vec<String>) -> u32 {
    let mut result = 0;

    for line in lines {
        let chars = line.chars().filter(|x| x.is_digit(10));

        let digits: Vec<u32> = chars.map(|x| x.to_digit(10).unwrap()).collect();

        let mut value = digits[0];
        if digits.len() > 1 {
            value = value * 10 + digits[digits.len() - 1]
        } else {
            value = value * 10 + value;
        }

        result += value;
    }

    return result;
}

fn is_digit(s: &str) -> usize {
    let mut chars = s.chars();

    let first = chars.next().unwrap();
    if first.is_digit(10) {
        return 1;
    }

    for letters in DIGITS_LETTERS {
        if s.starts_with(letters) {
            return letters.len();
        }
    }

    return 0;
}

fn replace_letters(s: &str) -> String {
    String::from(s)
        .replace("one", "1")
        .replace("two", "2")
        .replace("three", "3")
        .replace("four", "4")
        .replace("five", "5")
        .replace("six", "6")
        .replace("seven", "7")
        .replace("eight", "8")
        .replace("nine", "9")
}

fn first_digit(mut s: &str) -> String {
    while s.len() > 0 {
        let digit_length = is_digit(if s.len() >= 5 { &s[0..5] } else { s });

        if digit_length > 0 {
            return replace_letters(&s[0..digit_length]);
        }

        s = &s[1..s.len()];
    }

    return String::from("0");
}

fn last_digit(s: &str) -> String {
    let mut start = s.len() - 1;
    let mut end = s.len();

    loop {
        let digit_length = is_digit(&s[start..end]);
        if digit_length > 0 {
            return replace_letters(&s[start..end]);
        }

        if start == 0 {
            break;
        }
        start -= 1;
        if end - start > 5 {
            end -= 1;
        }
    }

    return String::from("0");
}

fn part2(lines: Vec<String>) -> u32 {
    let lines2: Vec<_> = lines
        .iter()
        .map(|line| {
            let first = first_digit(line.as_str());
            let last = last_digit(line.as_str());

            format!("{first}{last}")
        })
        .collect();

    return part1(lines2);
}

pub fn main(input: &str) {
    let lines = read_file_lines(input);

    println!("Part 1: {}", part1(lines.clone()));

    println!("Part 2: {}", part2(lines));
}

#[rstest]
#[case("pqr3stu8vwx", 38)]
#[case("1abc2", 12)]
#[case("a1b2c3d4e5f", 15)]
#[case("treb7uchet", 77)]
#[case("six3fqrvmrcrspsix7ptsseight", 37)]
fn test_part1(#[case] line: &str, #[case] expected_value: u32) {
    assert_eq!(part1(vec![String::from(line)]), expected_value);
}

#[rstest]
#[case("two1nine", 29)]
#[case("eighthree", 83)]
#[case("eightwothree", 83)]
#[case("abcone2threexyz", 13)]
#[case("xtwone3four", 24)]
#[case("4nineeightseven2", 42)]
#[case("zoneight234", 14)]
#[case("7pqrstsixteen", 76)]
#[case("six3fqrvmrcrspsix7ptsseight", 68)]
#[case("2pqpqgppm63ccptb", 23)]
#[case("rtdsxdz53seveneightsixzbtrbbm", 56)]
fn test_part2(#[case] line: &str, #[case] expected_value: u32) {
    assert_eq!(part2(vec![String::from(line)]), expected_value);
}
