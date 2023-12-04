use std::str::FromStr;

// Original from: https://github.com/chrismo80/advent_of_code/blob/default/src/extensions/converter.rs
pub trait Parser
{
    fn to_char_grid(&self) -> Vec<Vec<char>>;
    fn to_int_grid(&self) -> Vec<Vec<u32>>;
    fn to_matrix(&self, delim: &str) -> Vec<Vec<u32>>;
    fn to_vec<T: FromStr>(&self, delim: &str) -> Vec<T>;
    fn to_vec_of_vec<T: FromStr>(&self, delim1: &str, delim2: &str) -> Vec<Vec<T>>;
}

impl Parser for &str
{
    fn to_char_grid(&self) -> Vec<Vec<char>>
    {
        self.lines().map(|line| line.chars().collect()).collect()
    }

    fn to_int_grid(&self) -> Vec<Vec<u32>>
    {
        self.lines()
            .map(|line| line.chars().map(|ch| ch.to_digit(10).unwrap()).collect())
            .collect()
    }

    fn to_matrix(&self, delim: &str) -> Vec<Vec<u32>>
    {
        self.lines()
            .map(|line| line.split(delim).filter_map(|e| e.parse().ok()).collect())
            .collect()
    }

    fn to_vec<T: FromStr>(&self, delim: &str) -> Vec<T>
    {
        self.split(delim).filter_map(|e| e.parse().ok()).collect()
    }

    fn to_vec_of_vec<T: FromStr>(&self, delim1: &str, delim2: &str) -> Vec<Vec<T>>
    {
        self.split(delim1)
            .map(|e| e.to_vec(delim2))
            .filter(|e| !e.is_empty())
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rstest::*;

    #[rstest]
    #[case("abc", vec![vec!['a', 'b', 'c']])]
    #[case("abc\n123", vec![vec!['a', 'b', 'c'], vec!['1', '2', '3']])]
    fn test_to_char_grid(#[case] input: &str, #[case] expected_value: Vec<Vec<char>>) {
        assert_eq!(input.to_char_grid(), expected_value);
    }

    #[rstest]
    #[case("123", vec![vec![1, 2, 3]])]
    #[case("123\n7890", vec![vec![1, 2, 3], vec![7, 8, 9, 0]])]
    fn test_to_int_grid(#[case] input: &str, #[case] expected_value: Vec<Vec<u32>>) {
        assert_eq!(input.to_int_grid(), expected_value);
    }

    #[rstest]
    #[case("1 2 3\n11 22 99", vec![vec![1, 2, 3], vec![11, 22, 99]])]
    fn test_to_matrix(#[case] input: &str, #[case] expected_value: Vec<Vec<u32>>) {
        assert_eq!(input.to_matrix(" "), expected_value);
    }

    #[rstest]
    #[case(("1:2:3", ":"), vec![1, 2, 3])]
    #[case(("5 10  -2 0 1", " "), vec![5, 10, -2, 0, 1])]
    fn test_to_vec(#[case] input: (&str, &str), #[case] expected_value: Vec<i32>) {
        assert_eq!(input.0.to_vec::<i32>(input.1), expected_value);
    }

    #[rstest]
    #[case(("1:2:3\n44:555:6666", "\n", ":"), vec![vec![1, 2, 3], vec![44, 555, 6666]])]
    #[case(("5 10 | -2 0 1", "|", " "), vec![vec![5, 10], vec![-2, 0, 1]])]
    fn test_to_vec_of_vec(#[case] input: (&str, &str, &str), #[case] expected_value: Vec<Vec<i32>>) {
        assert_eq!(input.0.to_vec_of_vec::<i32>(input.1, input.2), expected_value);
    }
}
