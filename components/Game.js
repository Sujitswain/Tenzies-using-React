import React, { useEffect } from "react";
import Die from './Die'
import {nanoid} from "nanoid"
import Confetti from "react-confetti";

import './style.css'

export default function Game()
{
    const[dice, setDice] = React.useState(allNewDice())
    const[tenzies, settenzies] = React.useState(false)

    const[rolls, setRolls] = React.useState(0)
    const[bestRolls, setBestRolls] = React.useState(JSON.parse(localStorage.getItem("BestRolls")) || 0)
    

    // for setting current time
    const[time, setTime] = React.useState(0)
    const[running, setRunning] = React.useState(false)

    // setting the best time
    const[bestTime, setBestTime] = React.useState(JSON.parse(localStorage.getItem("BestTime")) || 0)

    // start the timer
    React.useEffect(()=>{
        let interval;
        if(running == true)
        {
            interval = setInterval(()=>{
                setTime(prevTime => prevTime = prevTime + 10)
            }, 10)
        }
        else if(!running)
        {
            clearInterval(interval)
        }
        return ()=>clearInterval(interval)

    }, [running])
    
    // check whether all dice are of same
    // number and also check that all dice
    // are selected
    React.useEffect(()=>{

        const someHeld = dice.some(die => die.isHeld)
        const allHeld = dice.every(die => die.isHeld)
        const allSameValue = dice.every(die => die.value === dice[0].value)
        
        if(someHeld)
        {
            setRunning(true)
        }

        if(allHeld && allSameValue)
        {
            // stop timer
            setRunning(false)

            // update rolls
            if(bestRolls == 0)
            {
                setBestRolls(rolls)
                localStorage.setItem("BestRolls", JSON.stringify(bestRolls))
            }
            else if(rolls < bestRolls)
            {
                setBestRolls(rolls)
                localStorage.setItem("BestRolls", JSON.stringify(bestRolls))
            }

            // update time
            if(bestTime == 0)
            {
                setBestTime(time)
                localStorage.setItem("BestTime", JSON.stringify(time))
            }
            else if(time < bestTime)
            {
                setBestTime(time)
                localStorage.setItem("BestTime", JSON.stringify(time))
            }

            // win
            settenzies(true)
        }
    }, [dice, time, bestTime])

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
            setTime(0)
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
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            
            <p className="instructions">
                Roll until all dice are the same. Click each
                die to freeze it at its current value between
                rolls
            </p>
            
            <div className="best-score-info">
                <span>
                    Best Rolls: {bestRolls}
                </span>
                <span>
                    Best Time:      
                    {
                        ("0" + Math.floor((bestTime/60000) % 60)).slice(-2)
                    }:
                    {
                        ("0" + Math.floor((bestTime/1000) % 60)).slice(-2)
                    }:
                    {
                        ("0" + (bestTime/10) % 100).slice(-2)
                    }
                </span>
            </div>

            { !tenzies 
                ?  
                    <>
                        <div className="dice-container">
                            {diceElements}
                        </div> 

                        <div className="current-info">
                            <span>
                                Number of rolls: {rolls}
                            </span>
                            <span>
                                Time: 
                                {
                                    ("0" + Math.floor((time/60000) % 60)).slice(-2)
                                }:
                                {
                                    ("0" + Math.floor((time/1000) % 60)).slice(-2)
                                }:
                                {
                                    ("0" + (time/10) % 100).slice(-2)
                                }
                            </span>
                        </div>
                    </>
                : 
                    <>
                        <h1>🙌 You Won 🙌</h1> 
                        <h3>Rolls : {rolls}</h3>
                        <h3>
                                Time: 
                                {
                                    ("0" + Math.floor((time/60000) % 60)).slice(-2)
                                }:
                                {
                                    ("0" + Math.floor((time/1000) % 60)).slice(-2)
                                }:
                                {
                                    ("0" + (time/10) % 100).slice(-2)
                                }
                        </h3>
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
