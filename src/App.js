import React from 'react';
import './App.css';
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
import Grid from '@material-ui/core/Grid';
// import FaIconPack from 'react-icons/lib/fa'

import {Component} from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            my_limit: 50,
            limit: 807,
            first_evolve: [],
            last_evolve: [],
            type: [
                {name: 'normal', color: '#A8A77A'},
                {name: 'fire', color: '#EE8130'},
                {name: 'water', color: '#6390F0'},
                {name: 'electric', color: '#F7D02C'},
                {name: 'grass', color: '#7AC74C'},
                {name: 'ice', color: '#96D9D6'},
                {name: 'fighting', color: '#C22E28'},
                {name: 'poison', color: '#A33EA1'},
                {name: 'ground', color: '#E2BF65'},
                {name: 'flying', color: '#A98FF3'},
                {name: 'psychic', color: '#F95587'},
                {name: 'bug', color: '#A6B91A'},
                {name: 'rock', color: '#B6A136'},
                {name: 'ghost', color: '#735797'},
                {name: 'dragon', color: '#6F35FC'},
                {name: 'dark', color: '#705746'},
                {name: 'steel', color: '#B7B7CE'},
                {name: 'fairy', color: '#D685AD'}
            ],
        }
    }

    componentDidMount() {
        fetch('https://pokeapi.co/api/v2/pokemon/?limit=' + this.state.limit)
            .then(results => {
                return results.json();
            }).then(data => {
            var tmp = [];
            data.results.map((pokemon, i) => {
                if (i < this.state.my_limit) {
                    tmp.push(pokemon)
                }
            })
            this.setState({
                data: data,
                loaded: true,
                results: tmp
            })
            this.loadInfos(this.state.offset, this.state.my_limit, tmp)
        })
    }

    loadInfos(offset, limit, data) {
        data.map((pokemon, i) => {
            i = i + offset + 1;
            if (i <= offset + limit && i >= offset) {
                fetch('https://pokeapi.co/api/v2/pokemon/' + i)
                    .then(results => {
                        return results.json();
                    }).then(infos => {
                    infos.types = infos.types.slice(0).reverse()
                    infos.types.map((info) => {
                        this.state.type.map((type) => {
                            if (type.name === info.type.name) {
                                info.color = type.color
                            }
                        })
                        pokemon.infos = infos;
                        this.setState({
                            results: data,
                        })
                    })
                })
            }
        })
    }

    next(offset, limit, data) {
        var tmp = [];
        this.setState({results: null})
        data.results.map((pokemon, i) => {
            if (i < offset + limit && i >= offset) {
                tmp.push(pokemon)
            }
        })
        this.setState({
            offset: offset,
            my_limit: limit,
            results: tmp,
            loaded: true
        })
        this.loadInfos(offset, limit, tmp)
    }

    select(pokemonID) {
        this.setState({
            last_evolve: [], first_evolve: []
        })
        fetch('https://pokeapi.co/api/v2/pokemon-species/' + pokemonID)
            .then(results => {
                return results.json();
            }).then(data => {
            fetch(data.evolution_chain.url)
                .then(results2 => {
                    return results2.json();
                }).then(data2 => {
                data2.chain.evolves_to.map((first_pokemon) => {
                    first_pokemon.evolves_to.map((second_pokemon) => {
                        let last_evolve = {id: '', name: ''}
                        let new_str = second_pokemon.species.url.split("pokemon-species/")[1];
                        new_str = new_str.split("/")[0];
                        last_evolve.id = new_str;
                        last_evolve.name = second_pokemon.species.name
                        if (last_evolve != null) {
                            this.setState({
                                last_evolve: this.state.last_evolve.concat(last_evolve)
                            })
                        }
                    })
                    let first_evolve = {id: '', name: ''}
                    let new_str = first_pokemon.species.url.split("pokemon-species/")[1];
                    new_str = new_str.split("/")[0];
                    first_evolve.id = new_str;
                    first_evolve.name = first_pokemon.species.name
                    if (first_evolve !== null) {
                        this.setState({
                            first_evolve: this.state.first_evolve.concat(first_evolve)
                        })
                    }
                })
                let base = {id: '', name: ''}
                let new_str = data2.chain.species.url.split("pokemon-species/")[1];
                new_str = new_str.split("/")[0];
                base.id = new_str;
                base.name = data2.chain.species.name
                this.setState({
                    base: base
                })
                fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonID)
                    .then(infos => {
                        return infos.json();
                    }).then(infos => {
                    this.setState({
                        infos: infos,
                        family: data2,
                        selectedPokemon: data,
                        pokemonID: pokemonID,
                        pokemon: true
                    })
                })
            })
        })
    }

    render() {
        if (!this.state.loaded) {
            return (
                <div className="App">
                </div>
            );
        } else {
            if (this.state.pokemon) {
                return (
                    <div className="App">
                        <header className="App-header">
                            <p onClick={() => this.setState({
                                pokemon: false,
                                last_evolve: [],
                                first_evolve: []
                            })}>Back</p>
                            <img
                                src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.state.pokemonID + '.png'}
                                alt={this.state.selectedPokemon.name}/>
                            <p>{this.state.selectedPokemon.name}</p>
                            <td>
                                {this.state.infos.types.map((type, i) => {
                                    return (
                                        <img style={{width: '60px', height: '60px'}}
                                             src={'./Types/' + type.type.name + '.png'}/>
                                    )
                                })}
                            </td>
                            <Table>
                                <Tbody>
                                <Tr>
                                    {this.state.first_evolve.length !== 0 ?
                                        <td>
                                            <div onClick={() => this.select(this.state.base.id)}>
                                                <img
                                                    src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.state.base.id + '.png'}
                                                    alt={this.state.base.name}/>
                                                <p>{this.state.base.name}</p>
                                            </div>
                                        </td>
                                        : null}
                                    <td style={this.state.first_evolve.length > 1 ? {
                                        'height': '400px',
                                        'overflow': 'scroll',
                                        'display': 'block'
                                    } : {overflow: 'none'}}>
                                        {this.state.first_evolve.map((pokemon, i) => {
                                            return (
                                                <div key={pokemon.name} onClick={() => this.select(pokemon.id)}>
                                                    <img
                                                        src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png'}
                                                        alt={pokemon.name}/>
                                                    <p>{pokemon.name}</p>
                                                </div>
                                            )
                                        })}
                                    </td>
                                    <td style={this.state.last_evolve.length > 1 ? {
                                        'height': '400px',
                                        'overflow': 'scroll',
                                        'display': 'block'
                                    } : {overflow: 'none'}}>
                                        {this.state.last_evolve.map((pokemon, i) => {
                                            return (
                                                <div key={pokemon.name} onClick={() => this.select(pokemon.id)}>
                                                    <img
                                                        src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png'}
                                                        alt={pokemon.name}/>
                                                    <p>{pokemon.name}</p>
                                                </div>
                                            )
                                        })}
                                    </td>
                                </Tr>
                                </Tbody>
                            </Table>
                            <div style={{'height': '400px', 'overflow': 'scroll', 'display': 'block'}}>
                                {this.state.infos.moves.map((move, i) => {
                                    return (
                                        <p key={i}>{move.move.name}</p>
                                    )
                                })}
                            </div>
                            <div style={{'height': '400px', 'overflow': 'scroll', 'display': 'block'}}>
                                {this.state.infos.held_items.map((item, i) => {
                                    return (
                                        <p key={i}>{item.item.name}</p>
                                    )
                                })}
                            </div>
                        </header>
                    </div>
                )
            } else {
                return (
                    <div className="App">
                        <header className="App-header">
                            <img src={'./logo.png'} className="App-logo" alt="logo" style={{height: '250px'}}/>
                            {this.state.offset !== 0 ?
                                <p onClick={() => this.next(this.state.offset - this.state.my_limit, this.state.my_limit, this.state.data)}>PREV</p>
                                : null}
                            {this.state.offset !== 800 ?
                                <p onClick={() => this.next(this.state.offset + this.state.my_limit, this.state.my_limit, this.state.data)}>NEXT</p>
                                : null}
                            <Grid container spacing={4}
                                  style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                {this.state.results.map((pokemon, i) => {
                                    i = i + this.state.offset + 1;
                                    return (
                                        <Grid item xs={2.5} spacing={1} key={pokemon.url} onClick={() => this.select(i)}
                                              style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                            <div style={{
                                                border: '1px solid',
                                                borderColor: pokemon.infos !== undefined ? pokemon.infos.types[0].color : null
                                            }}>
                                                <img key={pokemon.name}
                                                     src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + i + '.png'}
                                                     alt={pokemon.name}/>
                                                {pokemon.infos !== undefined ?
                                                    <Td style={{width: '300px'}}>
                                                        <p key={i}>{i} - {pokemon.name}</p>
                                                        {pokemon.infos !== undefined ?
                                                            (
                                                                <div>
                                                                    {pokemon.infos.types.map((type, i) => {
                                                                        return (
                                                                            <img style={{
                                                                                width: '60px',
                                                                                height: '60px'
                                                                            }}
                                                                                 src={'./Types/' + type.type.name + '.png'}/>
                                                                        )
                                                                    })}
                                                                </div>
                                                            ) : null
                                                        }
                                                    </Td>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                            <br/>
                        </header>
                    </div>
                );
            }
        }
    }
}

export default App;
