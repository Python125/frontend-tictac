import { useState, React, useEffect } from "react";
import axios from "axios";
import { Text, Box, Link, Input } from '@chakra-ui/react';

const apiURL = import.meta.env.VITE_URL;
// console.log('API URL:', apiURL);

function GameList({ userId }) {
  const [games, setGames] = useState([]);
  const [gameInput, setGameInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      const response = await axios.get(`${apiURL}/games`);
      const gamesData = Array.isArray(response.data) ? response.data : [];
      setGames(gamesData);
      setUsername(response.data.username || '');
    }
    fetchGames();
  }, [userId]);

  function addGame(e) {
    setGameInput(e.target.value);
  }

  function submitGame(e) {
    e.preventDefault();
    if (!gameInput.trim()) return;

    const newGame = {
      id: games.length + 1,
      name: gameInput,
      maxParticipantCount: 2,
      minBuyInAmount: 0,
      maxBuyInAmount: 0,
      status: 'Active',
      userId: userId,
    }
    console.log(newGame);

    axios.post(`${apiURL}/games`, newGame).then(response => {
      setGames([...games, response.data]);
      setGameInput('');
    })
  }

  return (
    <Box>
      <form onSubmit={submitGame}>
        <Input type="text" width='200px' marginBottom='10px' marginTop='10px' placeholder="Enter new game" onChange={addGame} value={gameInput} />
      </form>
      <Text fontWeight='bold' fontSize='2xl'>Join a game below</Text>
      <ul>
        {games.map((game, index) => {
          return (
            <li key={game.id || index}>
              <Link variant='plain' _hover={{textDecoration: 'underline', color: 'blue.600'}} href={`/games/${game.id}`} color='black'>{game.name}</Link>
            </li>
          )
        })}
      </ul>
    </Box>
  )
}

export default GameList;