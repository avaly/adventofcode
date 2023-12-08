use std::collections::HashMap;

use num::integer::lcm;
use regex::Regex;

#[derive(Debug, Clone, PartialEq)]
struct Node {
    name: String,
    left: String,
    right: String,
}

impl Node {
    fn from(contents: &str) -> Self {
        let re_node = Regex::new(r"^(.+) = \((.+), (.+)\)$").unwrap();

        let captures = re_node.captures(contents).unwrap();

        Self {
            name: String::from(captures.get(1).unwrap().as_str()),
            left: String::from(captures.get(2).unwrap().as_str()),
            right: String::from(captures.get(3).unwrap().as_str()),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
enum Move {
    Left,
    Right,
}

#[derive(Debug, Clone, PartialEq)]
struct Data {
    nodes: HashMap<String, Node>,
    moves: Vec<Move>,
}

impl Data {
    fn from(contents: &str) -> Self {
        let mut nodes = HashMap::new();

        let lines = contents.lines().collect::<Vec<_>>();

        lines.clone().into_iter().skip(2).for_each(|line| {
            let node = Node::from(line);
            nodes.insert(node.name.clone(), node);
        });

        Self {
            nodes,
            moves: lines
                .first()
                .unwrap()
                .chars()
                .into_iter()
                .map(|ch| match ch {
                    'L' => Move::Left,
                    'R' => Move::Right,
                    _ => panic!("Unexpected character"),
                })
                .collect(),
        }
    }
}

fn node_distance<F>(data: &Data, start_node: &Node, mut is_node_finish: F) -> usize
where
    F: FnMut(&String) -> bool,
{
    let mut count = 0;
    let mut node = &start_node.clone();

    while !is_node_finish(&node.name) {
        let this_move = &data.moves[count % data.moves.len()];

        match this_move {
            Move::Left => node = data.nodes.get(&node.left).unwrap(),
            Move::Right => node = data.nodes.get(&node.right).unwrap(),
        }

        count += 1;
    }

    return count;
}

fn part1(data: Data) -> usize {
    node_distance(&data, data.nodes.get("AAA").unwrap(), |name| name == "ZZZ")
}

fn part2(data: Data) -> usize {
    data.nodes
        .keys()
        .into_iter()
        .filter_map(|key| {
            if key.ends_with("A") {
                Some(node_distance(&data, data.nodes.get(key).unwrap(), |name| {
                    name.ends_with("Z")
                }))
            } else {
                None
            }
        })
        .fold(1, lcm)
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
    #[case("AAA = (BBB, CCC)", Node { name: String::from("AAA"), left: String::from("BBB"), right: String::from("CCC") })]
    fn test_parse_node(#[case] contents: &str, #[case] expected_value: Node) {
        assert_eq!(Node::from(contents), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample.txt"), 2)]
    #[case(include_str!("sample2.txt"), 6)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    #[rstest]
    #[case(include_str!("sample3.txt"), 6)]
    fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part2(Data::from(contents)), expected_value);
    }
}
