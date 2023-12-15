use regex::Regex;

#[derive(Debug, Clone, PartialEq)]
enum Operation {
    Add,
    Remove,
}

#[derive(Debug, Clone, PartialEq)]
struct Lens {
    label: String,
    focal: usize,
    operation: Operation,
}

impl Lens {
    fn from(input: &str) -> Self {
        let re_lens = Regex::new(r"^([^=-]+)([=-])(\d*)$").unwrap();
        let captures = re_lens.captures(input).unwrap();

        let focal = captures.get(3).unwrap().as_str();
        let focal = if focal.len() > 0 {
            focal.parse().unwrap()
        } else {
            0
        };

        Self {
            label: String::from(captures.get(1).unwrap().as_str()),
            focal,
            operation: if captures
                .get(2)
                .unwrap()
                .as_str()
                .chars()
                .collect::<Vec<_>>()
                .first()
                .unwrap()
                == &'='
            {
                Operation::Add
            } else {
                Operation::Remove
            },
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    items: Vec<String>,
}

impl Data {
    fn from(contents: &str) -> Self {
        let items = contents
            .trim()
            .split(',')
            .map(|item| String::from(item))
            .collect::<Vec<_>>();

        Self { items }
    }
}

fn hash(input: &str) -> usize {
    input
        .chars()
        .into_iter()
        .fold(0, |acc, ch| ((acc + (ch as usize)) * 17) % 256)
}

fn part1(data: Data) -> usize {
    data.items.iter().map(|item| hash(item)).sum()
}

fn part2(data: Data) -> usize {
    let mut boxes_raw: Vec<Vec<Lens>> = Vec::new();

    for _ in 0..256 {
        boxes_raw.push(Vec::new());
    }

    let boxes = boxes_raw.as_mut_slice();

    for item in data.items.iter() {
        let lens = Lens::from(item);

        let bi = hash(&lens.label);
        let previous = boxes[bi].iter().position(|item| item.label.eq(&lens.label));

        match lens.operation {
            Operation::Add => match previous {
                Some(index) => {
                    boxes[bi].remove(index);
                    boxes[bi].insert(index, lens);
                }
                None => {
                    boxes[bi].push(lens);
                }
            },
            Operation::Remove => match previous {
                Some(index) => {
                    boxes[bi].remove(index);
                }
                None => {}
            },
        }
    }

    let mut power = 0;

    for index in 0..256 {
        for (lens_index, lens) in boxes[index].iter().enumerate() {
            power += (index + 1) * (lens_index + 1) * lens.focal;
        }
    }

    power
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
    #[case("HASH", 52)]
    #[case("rn=1", 30)]
    #[case("rn", 0)]
    fn test_hash(#[case] input: &str, #[case] expected_value: usize) {
        assert_eq!(hash(input), expected_value);
    }

    #[rstest]
    #[case("rn=1", Lens {
        label: String::from("rn"),
        focal: 1,
        operation: Operation::Add
    })]
    #[case("qp-", Lens {
        label: String::from("qp"),
        focal: 0,
        operation: Operation::Remove
    })]
    fn test_parse_lens(#[case] input: &str, #[case] expected_value: Lens) {
        assert_eq!(Lens::from(input), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 1320)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"),145)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
