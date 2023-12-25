// use crate::vectors::Parser;

use std::cmp::min;

// use crate::debug::dbg_matrix_as_slice;

#[derive(Debug, Clone, PartialEq)]
struct Data<'a> {
    edges: Vec<(usize, usize)>,
    nodes: Vec<&'a str>,
}

impl<'a> Data<'a> {
    fn from(contents: &'a str) -> Self {
        let mut nodes: Vec<&'a str> = Vec::new();
        let mut edges = Vec::new();

        for line in contents.lines() {
            let parts = line.split(": ").collect::<Vec<_>>();

            let name = parts[0];
            let connections = parts[1].split(" ").collect::<Vec<_>>();

            for connection in connections {
                if !nodes.contains(&name) {
                    nodes.push(name);
                }
                if !nodes.contains(&connection) {
                    nodes.push(connection);
                }

                let name_index = nodes.iter().position(|value| value == &name).unwrap();
                let connection_index = nodes.iter().position(|value| value == &connection).unwrap();

                edges.push((name_index, connection_index));
                edges.push((connection_index, name_index));
            }
        }

        Self { edges, nodes }
    }

    fn solve1(&self) -> usize {
        let size = self.nodes.len();

        let mut visited_vec = vec![0usize; size];
        let visited = visited_vec.as_mut_slice();

        let mut discovery_vec = vec![-1; size];
        let discovery = discovery_vec.as_mut_slice();

        let mut low_vec = vec![-1; size];
        let low = low_vec.as_mut_slice();

        let mut timer = 1;

        // for node in 0..size {
        //     if visited[node] == 0 {
        self.dfs(0, 0, &mut timer, visited, discovery, low);
        // }
        // }

        println!("nodes: {} {:?}", &self.nodes.len(), self.nodes);
        println!("discovery: {:?}", &discovery);
        println!("low: {:?}", &low);
        // dbg!(&self.nodes);
        // dbg!(&self.edges);
        // dbg!(visited);

        for (a, b) in self.edges.iter() {
            if low[*b] > discovery[*a] {
                println!("BRIDGE: {} - {}", a, b);
            }
        }

        0
    }

    fn dfs(
        &self,
        node: usize,
        parent: usize,
        timer: &mut isize,
        visited: &mut [usize],
        discovery: &mut [isize],
        low: &mut [isize],
    ) {
        println!("dfs({}, {}, {})", node, parent, timer);

        visited[node] = 1;
        discovery[node] = *timer;
        low[node] = *timer;
        *timer += 1;

        let edges = self
            .edges
            .iter()
            .filter(|(a, _)| a == &node)
            .map(|(_, b)| b)
            .collect::<Vec<_>>();

        for edge in edges {
            println!("dfs({}, {}): > {}", node, parent, edge);

            if *edge == parent {
                println!("skip parent");
                continue;
            }

            if visited[*edge] == 1 {
                println!(
                    "low[{}] = min(low[{}] = {}, discovery[{}] = {}) = {}",
                    node,
                    node,
                    low[node],
                    *edge,
                    discovery[*edge],
                    min(low[node], discovery[*edge])
                );
                low[node] = min(low[node], discovery[*edge]);
            } else {
                self.dfs(*edge, node, timer, visited, discovery, low);

                // if discovery[node] <= low[*edge] {
                //     println!("BRIDGE in algorithm: {} - {}", node, edge);
                // }

                println!(
                    "low[{}] = min(low[{}] = {}, low[{}] = {}) = {}",
                    node,
                    node,
                    low[node],
                    *edge,
                    low[*edge],
                    min(low[node], low[*edge])
                );
                low[node] = min(low[node], low[*edge]);
            }
        }

        println!("/dfs({}, {}, {})", node, parent, timer);
    }
}

fn part1(data: Data) -> usize {
    // dbg!(&data);
    data.solve1()
}

fn part2(_data: Data) -> usize {
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
    #[case(include_str!("sample.txt"), 54)]
    // #[case(include_str!("sample-2.txt"), 54)]
    fn test_part1(#[case] contents: &str, #[case] expected_value: usize) {
        assert_eq!(part1(Data::from(contents)), expected_value);
    }

    // #[rstest]
    // #[case(include_str!("sample.txt"), 0)]
    // fn test_part2(#[case] contents: &str, #[case] expected_value: usize) {
    //     assert_eq!(part2(Data::from(contents)), expected_value);
    // }
}
