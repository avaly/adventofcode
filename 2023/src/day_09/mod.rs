use crate::vectors::Parser;

#[derive(Debug, Clone, PartialEq)]
struct History {
    values: Vec<i64>,
}

impl History {
    fn from(contents: &str) -> Self {
        Self {
            values: contents.to_vec(" "),
        }
    }

    fn diffs(&self) -> Vec<i64> {
        self.values
            .iter()
            .skip(1)
            .enumerate()
            .map(|(index, value)| value - self.values[index])
            .collect()
    }

    fn predict(&self) -> i64 {
        let diffs = self.diffs();

        let min = diffs.iter().min().unwrap();
        let max = diffs.iter().max().unwrap();

        if min == &0 && max == &0 {
            *self.values.last().unwrap()
        } else {
            let next = Self { values: diffs };

            self.values.last().unwrap() + next.predict()
        }
    }

    fn predict_backwards(&self) -> i64 {
        let diffs = self.diffs();

        let min = diffs.iter().min().unwrap();
        let max = diffs.iter().max().unwrap();

        if min == &0 && max == &0 {
            *self.values.first().unwrap()
        } else {
            let next = Self { values: diffs };

            self.values.first().unwrap() - next.predict_backwards()
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    items: Vec<History>,
}

impl Data {
    fn from(contents: &str) -> Self {
        Self {
            items: contents
                .lines()
                .into_iter()
                .map(|line| History::from(line))
                .collect(),
        }
    }
}

fn part1(data: Data) -> i64 {
    data.items
        .into_iter()
        .map(|history| history.predict())
        .sum()
}

fn part2(data: Data) -> i64 {
    data.items
        .into_iter()
        .map(|history| history.predict_backwards())
        .sum()
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
    #[case("0 3 6 9 12 15", History { values: vec![0, 3, 6, 9, 12, 15] })]
    fn test_parse_history(#[case] contents: &str, #[case] expected_value: History) {
        assert_eq!(History::from(contents), expected_value);
    }

    #[rstest]
    #[case("0 3 6 9 12 15", 18)]
    #[case("1 3 6 10 15 21", 28)]
    #[case("10 13 16 21 30 45", 68)]
    fn test_predict_history(#[case] contents: &str, #[case] expected_value: i64) {
        assert_eq!(History::from(contents).predict(), expected_value);
    }

    #[rstest]
    #[case("10 13 16 21 30 45", 5)]
    fn test_predict_backwards_history(#[case] contents: &str, #[case] expected_value: i64) {
        assert_eq!(History::from(contents).predict_backwards(), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 114)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: i64) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 2)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: i64) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
