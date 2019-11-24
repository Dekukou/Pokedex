import React from 'react';
import './App.css';
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
import Grid from '@material-ui/core/Grid';
import {FaAngleDoubleLeft, FaAngleDoubleRight, FaArrowCircleLeft} from "react-icons/fa";

import {Component} from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            offset: 0,
            my_limit: 50,
            limit: 807,
            first_evolve: [],
            last_evolve: [],
            show: false,
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
            ]
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
                    infos.types = infos.types.slice(0).reverse()
                    infos.types.map((info) => {
                        this.state.type.map((type) => {
                            if (type.name === info.type.name) {
                                info.color = type.color
                            }
                        })
                        base.infos = infos;
                        this.setState({
                            base: base,
                        })
                    })
                    this.setState({
                        infos: infos,
                        family: data2,
                        selectedPokemon: data,
                        pokemonID: pokemonID,
                        visible: true
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
            return (
                <div className="App">
                    <header className="App-header">
                        <br/>
                        <Grid container spacing={4}
                              style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                            <Grid container item xs={4} spacing={1} style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                height: '250px',
                                overflow: 'scroll'
                            }}>
                                <p onClick={() => this.setState({show: !this.state.show})}>Types</p>
                                {this.state.show === true ?
                                    this.state.type.map((type, i) => {
                                        return (
                                            <Grid item xs={2.5} spacing={1} key={type.name}>
                                                <div style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    display: 'flex'
                                                }}>
                                                    <img style={{height: '70px'}}
                                                         src={'./Types/' + type.name + '.png'}/>
                                                    <input type="checkbox" onChange={this.handleCheck}
                                                           defaultChecked={this.state.checked}/>
                                                </div>
                                            </Grid>
                                        )
                                    }) : null}
                            </Grid>
                            <Grid item xs={3} style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                <img src={'./logo.png'} className="App-logo" alt="logo" style={{height: '250px'}}/>
                            </Grid>
                            <Grid container item xs={4} spacing={1} style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                height: '250px',
                                overflow: 'scroll'
                            }}>
                                <Grid item xs={2.5} spacing={1} key={10}>
                                    <div style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex'
                                    }}>
                                    <button style={{
                                        background: this.state.my_limit == 10 ? "blue" : "red",
                                        borderRadius: "10px",
                                        fontSize: "15px",
                                        color: "white",
                                        height: "25px",
                                        width: "50px"
                                    }}
                                            onClick={() => {
                                                this.setState({my_limit: 10});
                                                this.next(this.state.offset, 10, this.state.data)
                                            }}>10
                                    </button>
                                    </div>
                                </Grid>
                                <Grid item xs={2.5} spacing={1} key={20}>
                                    <div style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex'
                                    }}>
                                    <button style={{
                                        background: this.state.my_limit == 20 ? "blue" : "red",
                                        borderRadius: "10px",
                                        fontSize: "15px",
                                        color: "white",
                                        height: "25px",
                                        width: "50px"
                                    }}
                                            onClick={() => {
                                                this.setState({my_limit: 20});
                                                this.next(this.state.offset, 20, this.state.data)
                                            }}>20
                                    </button>
                                    </div>
                                </Grid>
                                <Grid item xs={2.5} spacing={1} key={30}>
                                    <div style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex'
                                    }}>
                                    <button style={{
                                        background: this.state.my_limit == 30 ? "blue" : "red",
                                        borderRadius: "10px",
                                        fontSize: "15px",
                                        color: "white",
                                        height: "25px",
                                        width: "50px"
                                    }}
                                            onClick={() => {
                                                this.setState({my_limit: 30});
                                                this.next(this.state.offset, 30, this.state.data)
                                            }}>30
                                    </button>
                                    </div>
                                </Grid>
                                <Grid item xs={2.5} spacing={1} key={40}>
                                    <div style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex'
                                    }}>
                                    <button style={{
                                        background: this.state.my_limit == 40 ? "blue" : "red",
                                        borderRadius: "10px",
                                        fontSize: "15px",
                                        color: "white",
                                        height: "25px",
                                        width: "50px"
                                    }}
                                            onClick={() => {
                                                this.setState({my_limit: 40});
                                                this.next(this.state.offset, 40, this.state.data)
                                            }}>40
                                    </button>
                                    </div>
                                </Grid>
                                <Grid item xs={2.5} spacing={1} key={50}>
                                    <div style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        display: 'flex'
                                    }}>
                                    <button style={{
                                        background: this.state.my_limit == 50 ? "blue" : "red",
                                        borderRadius: "10px",
                                        fontSize: "15px",
                                        color: "white",
                                        height: "25px",
                                        width: "50px"
                                    }}
                                            onClick={() => {
                                                this.setState({my_limit: 50});
                                                this.next(this.state.offset, 50, this.state.data)
                                            }}>50
                                    </button>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>

                        <div>
                            {this.state.offset !== 0 ?
                                <FaAngleDoubleLeft
                                    onClick={() => this.next(this.state.offset - this.state.my_limit, this.state.my_limit, this.state.data)}
                                    style={{padding: '50px'}}/>
                                : null}
                            {(this.state.offset + this.state.my_limit) < 807 ?
                                <FaAngleDoubleRight
                                    onClick={() => this.next(this.state.offset + this.state.my_limit, this.state.my_limit, this.state.data)}
                                    style={{padding: '50px'}}/>
                                : null}
                        </div>

                        {/*Infos PKM*/}

                        {this.state.visible && (
                            <div style={{
                                overflow: "scroll",
                                position: "fixed",
                                top: "6%",
                                height: "93%",
                                width: "40%",
                                border: '1px solid',
                                backgroundColor: "rgba(40, 44, 52, 0.75)",
                                borderColor: this.state.infos.types[0].color
                            }}>
                                <div style={{padding: 15}}>
                                    <div style={{
                                        backgroundColor: this.state.infos.types[0].color,
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <FaArrowCircleLeft onClick={() => this.setState({
                                            visible: false,
                                            pokemon: false,
                                            last_evolve: [],
                                            first_evolve: []
                                        })} style={{position: "absolute", padding: '10px', top: 20, left: 10}}/>
                                        <p style={{display: "flex"}}>#{this.state.selectedPokemon.id} {this.state.selectedPokemon.name.charAt(0).toUpperCase() + this.state.selectedPokemon.name.slice(1)}</p>
                                        <td style={{
                                            position: "absolute",
                                            right: 40,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            display: 'flex'
                                        }}>
                                            {this.state.infos.types.map((type, i) => {
                                                return (
                                                    <img key={i} style={{width: '60px', height: '60px'}}
                                                         src={'./Types/' + type.type.name + '.png'}/>
                                                )
                                            })}
                                        </td>
                                    </div>
                                    <img
                                        src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.state.pokemonID + '.png'}
                                        alt={this.state.selectedPokemon.name}
                                        style={{verticalAlign: "center", height: "160", width: "160px"}}/>
                                    <p style={{fontSize: 20}}>{this.state.selectedPokemon.genera[2].genus}</p>
                                    {this.state.first_evolve.length !== 0 ?
                                        <div style={{
                                            width: "100%",
                                            backgroundColor: this.state.infos.types[0].color,
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <p style={{fontSize: "20px"}}>Evolutions</p>
                                        </div>
                                        : null}
                                    <Table
                                        style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                        <Tbody>
                                        <Tr>
                                            {this.state.first_evolve.length !== 0 ?
                                                <td>
                                                    <div onClick={() => this.select(this.state.base.id)}>
                                                        <img
                                                            src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + this.state.base.id + '.png'}
                                                            alt={this.state.base.name}/>
                                                        <p style={{fontSize: "18px"}}>{this.state.base.name.charAt(0).toUpperCase() + this.state.base.name.slice(1)}</p>
                                                    </div>
                                                </td>
                                                : null}
                                            <td style={this.state.first_evolve.length > 1 ? {
                                                'height': '160px',
                                                'overflow': 'scroll',
                                                'display': 'block'
                                            } : {overflow: 'none'}}>
                                                {this.state.first_evolve.map((pokemon, i) => {
                                                    return (
                                                        <div key={pokemon.name}
                                                             onClick={() => this.select(pokemon.id)}>
                                                            <img
                                                                src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png'}
                                                                alt={pokemon.name}/>
                                                            <p style={{fontSize: "18px"}}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
                                                        </div>
                                                    )
                                                })}
                                            </td>
                                            <td style={this.state.last_evolve.length > 1 ? {
                                                'height': '160px',
                                                'overflow': 'scroll',
                                                'display': 'block'
                                            } : {overflow: 'none'}}>
                                                {this.state.last_evolve.map((pokemon, i) => {
                                                    return (
                                                        <div key={pokemon.name}
                                                             onClick={() => this.select(pokemon.id)}>
                                                            <img
                                                                src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemon.id + '.png'}
                                                                alt={pokemon.name}/>
                                                            <p style={{fontSize: "18px"}}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
                                                        </div>
                                                    )
                                                })}
                                            </td>
                                        </Tr>
                                        </Tbody>
                                    </Table>
                                    <div style={{
                                        width: "100%",
                                        backgroundColor: this.state.infos.types[0].color,
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <p style={{fontSize: "20px"}}>Moves</p>
                                    </div>
                                    <div>
                                        <p style={{
                                            textDecorationLine: 'underline',
                                            position: "absolute",
                                            left: 20,
                                            fontSize: "17px"
                                        }}>Natural
                                            Moves</p>
                                        <br/>
                                        <div style={{maxHeight: '300px', overflow: 'scroll'}}>
                                            {this.state.infos.moves.sort((a, b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at).map((move, i) => {
                                                return (
                                                    move.version_group_details[0].move_learn_method.name === "level-up" ?
                                                        <div key={i} style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>
                                                            <p key={"learn" + i}
                                                               style={{fontSize: 15}}>Lv {move.version_group_details[0].level_learned_at + " " + move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)}</p>
                                                        </div>

                                                        : null)
                                            })}
                                        </div>
                                        <p style={{
                                            textDecorationLine: 'underline',
                                            position: "absolute",
                                            left: 20,
                                            fontSize: "17px"
                                        }}>Machine
                                            Moves</p>
                                        <br/>
                                        <div style={{maxHeight: '300px', overflow: 'scroll'}}>
                                            {this.state.infos.moves.sort((a, b) => a.move.name - b.move.name).map((move, i) => {
                                                return (
                                                    move.version_group_details[0].move_learn_method.name === "machine" ?
                                                        <div key={i} style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>
                                                            <p key={"learn" + i}
                                                               style={{fontSize: 15}}>{move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)}</p>
                                                        </div>

                                                        : null)
                                            })}
                                        </div>
                                        <p style={{
                                            textDecorationLine: 'underline',
                                            position: "absolute",
                                            left: 20,
                                            fontSize: "17px"
                                        }}>Tutor
                                            Moves</p>
                                        <br/>
                                        <div style={{maxHeight: '300px', overflow: 'scroll'}}>
                                            {this.state.infos.moves.sort((a, b) => a.move.name - b.move.name).map((move, i) => {
                                                return (
                                                    move.version_group_details[0].move_learn_method.name === "tutor" ?
                                                        <div key={i} style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>
                                                            <p key={"learn" + i}
                                                               style={{fontSize: 15}}>{move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)}</p>
                                                        </div>

                                                        : null)
                                            })}
                                        </div>
                                        <p style={{
                                            textDecorationLine: 'underline',
                                            position: "absolute",
                                            left: 20,
                                            fontSize: "17px"
                                        }}>Egg Moves</p>
                                        <br/>
                                        <div style={{maxHeight: '300px', overflow: 'scroll'}}>
                                            {this.state.infos.moves.sort((a, b) => a.move.name - b.move.name).map((move, i) => {
                                                return (
                                                    move.version_group_details[0].move_learn_method.name === "egg" ?
                                                        <div key={i} style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>
                                                            <p key={"learn" + i}
                                                               style={{fontSize: 15}}>{move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1)}</p>
                                                        </div>

                                                        : null)
                                            })}
                                        </div>
                                    </div>
                                    <br/>
                                    {this.state.infos.held_items.length !== 0 ?
                                        <div style={{
                                            width: "100%",
                                            backgroundColor: this.state.infos.types[0].color,
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <p style={{fontSize: "20px"}}>Held Items</p>
                                        </div>
                                        : null}
                                    {this.state.infos.held_items.length !== 0 ?
                                        <div>
                                            {this.state.infos.held_items.map((item, i) => {
                                                return (
                                                    <p key={i}
                                                       style={{fontSize: 15}}>{item.item.name.charAt(0).toUpperCase() + item.item.name.slice(1)}</p>
                                                )
                                            })}
                                        </div>
                                        : null}
                                    <div style={{
                                        width: "100%",
                                        backgroundColor: this.state.infos.types[0].color,
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <p style={{fontSize: "20px"}}>Descriptions</p>
                                    </div>
                                    <div style={{maxHeight: '300px', overflow: 'scroll'}}>
                                        {this.state.selectedPokemon.flavor_text_entries.map((description, i) => {
                                            return (
                                                description.language.name === 'en' ?
                                                    <p key={i} style={{
                                                        fontSize: 15,
                                                        border: '1px solid',
                                                        borderColor: this.state.infos.types[0].color
                                                    }}>{description.flavor_text}</p>
                                                    :
                                                    null
                                            )
                                        })}
                                    </div>
                                    <div style={{
                                        width: "100%",
                                        backgroundColor: this.state.infos.types[0].color,
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <br/>
                                        <br/>
                                        <p style={{fontSize: "20px"}}>Sprites</p>
                                    </div>
                                    <div>
                                        {this.state.infos.sprites.front_default !== null ?
                                            <img src={this.state.infos.sprites.front_default}/> : null}
                                        {this.state.infos.sprites.front_female !== null ?
                                            <img src={this.state.infos.sprites.front_female}/> : null}
                                        {this.state.infos.sprites.front_shiny !== null ?
                                            <img src={this.state.infos.sprites.front_shiny}/> : null}
                                        {this.state.infos.sprites.front_shiny_female !== null ?
                                            <img src={this.state.infos.sprites.front_shiny_female}/> : null}
                                        <br/>
                                        {this.state.infos.sprites.back_default !== null ?
                                            <img src={this.state.infos.sprites.back_default}/> : null}
                                        {this.state.infos.sprites.back_female !== null ?
                                            <img src={this.state.infos.sprites.back_female}/> : null}
                                        {this.state.infos.sprites.back_shiny !== null ?
                                            <img src={this.state.infos.sprites.back_shiny}/> : null}
                                        {this.state.infos.sprites.back_shiny_female !== null ?
                                            <img src={this.state.infos.sprites.back_shiny_female}/> : null}
                                    </div>
                                </div>
                            </div>

                        )}

                        {/*List PKM*/}

                        <Grid container spacing={4}
                              style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                            {this.state.results.map((pokemon, i) => {
                                i = i + this.state.offset + 1;
                                return (
                                    <Grid item xs={2.5} key={pokemon.url} onClick={() => this.select(i)}
                                          style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                                        <div style={{
                                            border: '1px solid',
                                            borderColor: pokemon.infos !== undefined ? pokemon.infos.types[0].color : null
                                        }}>
                                            <img key={pokemon.name}
                                                 src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + i + '.png'}
                                                 alt={pokemon.name}
                                                 style={{minWidth: '125px'}}/>
                                            {pokemon.infos !== undefined ?
                                                <Td style={{width: '300px'}}>
                                                    <p key={i}>{i} - {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
                                                    {pokemon.infos !== undefined ?
                                                        (
                                                            <div>
                                                                {pokemon.infos.types.map((type, i) => {
                                                                    return (
                                                                        <img style={{
                                                                            height: '70px'
                                                                        }}
                                                                             key={i}
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

export default App;
