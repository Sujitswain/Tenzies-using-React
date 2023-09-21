import React from "react";
import Die from './Die'
import {nanoid} from "nanoid"

import './style.css'

export default function Game()
{
    const[dice, setDice] = React.useState(allNewDice())
    const[rolls, setRolls] = React.useState(0)
    const[tenzies, settenzies] = React.useState(false)

    // check whether all dice are of same
    // number and also check that all dice
    // are selected
    React.useEffect(()=>{

        const allHeld = dice.every(die => die.isHeld)
        const allSameValue = dice.every(die => die.value === dice[0].value)
    
        if(allHeld && allSameValue)
            settenzies(true)
    }, [dice])

    // generating the object 
    // with all necessary fields
    function generateNewDie()
    {
        return(
            {
                id: nanoid(),
                value: Math.ceil(Math.random() * 6),
                isHeld: false
            }
        );
    }

    // generating 10 objects 
    // for the dice component
    function allNewDice()
    {
        const newDice = []
        for(let i=0; i<10; i++)
        {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    // changing the random number
    // of all the dice except
    // the selected one
    function rollDice()
    {
        if(!tenzies)
        {
            setDice(oldDice => oldDice.map(die=>{
                return(
                    die.isHeld ? die : generateNewDie()
                );
            }))

            setRolls( prevRolls => prevRolls + 1 )
        }
        else
        {
            setRolls(0)
            settenzies(false)
            setDice(allNewDice())
        }
    }

    // after clicking a dice component
    // make it marked
    function holdDice(id)
    {
        setDice(oldDice => oldDice.map((die)=>{
            return (
                die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
            );
        }))
    }

    // generate dice component
    const diceElements = dice.map((die) => {
        return(
            <Die 
                key={die.id} 
                value={die.value} 
                isHeld={die.isHeld}
                holdDice={ ()=>holdDice(die.id) }
            />
        );
    })

    return(
       <main>
            <h1 className="title">Tenzies</h1>
            
            <p className="instructions">
                Roll until all dice are the same. Click each
                die to freeze it at its current value between
                rolls
            </p>
            { !tenzies 
                ?  
                    <>
                        <div className="dice-container">
                            {diceElements}
                        </div> 

                        <span>Number of rolls: {rolls}</span>
                    </>
                : 
                    <>
                        <h1>🙌 You Won 🙌</h1> 
                        <h3>Rolls : {rolls}</h3>
                    </>
            }
            
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>

       </main>
    );
}
