//import
import {useState, useEffect} from 'react';
import {FaStar} from 'react-icons/fa';
import './App.css';

function App() {
  //state vars
  const [repositories, setRepositories] = useState([]);
  const [location, setLocation] = useState({});
  const [owner, setOwner] = useState('');

  //effects
  useEffect(() => {
    async function getRepositories(owner){
      if(owner != ''){
        const response = await fetch(`https://api.github.com/users/${owner}/repos`);
        const data = await response.json();
        setRepositories(data);
      }
    }
    getRepositories(owner);
  }, [owner]);

  useEffect(() => {
    const filtered = repositories.filter(repo => {
      return repo.favorite;
    }); 

    document.title = `${filtered.length} favoritos`;
  }, [repositories]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(handlePositionReceived);
    return () => navigator.geolocation.clearWatch(watchId); 
  }, []);  

  //handlers
  function handleFavorite(id){
    const newRepositories = repositories.map(repo => {
      return repo.id === id ? {...repo, favorite: !repo.favorite} : repo; 
    });
    setRepositories(newRepositories);
  }

  function handlePositionReceived({coords}){
    console.log(coords);
    setLocation({latitude: coords.latitude, longitude: coords.longitude});
  }

  function handleChangeOwner(){
    const user = window.prompt('Digite um usuário do github: ');
    if(user != '' && user != null){
      setOwner(user);
    }
  }

  return (
    <div className='App'>
      <h1>Treino React Hooks</h1>
      <h3>Repositórios do usuário {owner != '' ? owner : 'Não informado'} </h3>
      <p>Há limite de requisições (quantas vezes pode consultar API) e a API só traz os 30 primeiros resultados...</p>

      {owner != '' && ( 
        repositories.length > 0 ? ( 
          <ul>
          {repositories.map((repository) => (
            <li className={repository.favorite? 'favorite' : ''} key={repository.id}>
              <a target='_blank' href={'https://github.com/'+repository.full_name}>{repository.name}</a>          
                <FaStar onClick={() => handleFavorite(repository.id)}></FaStar>
            </li>
          ))}
          </ul> 
        ): (
          <p>Não há repositórios...</p>
        )
      )}

      <button className='changeUser' onClick={handleChangeOwner}>Mudar Usuário</button>

      <h3 className='margin'>Localização do navegador</h3>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      <p className='tips'>Para mudar a localização, vá para ferramentas de desenvolvedor apertando f12 &gt; Customize and control dev tools &gt; More tools &gt; Sensor  </p>
    </div>
  );
}

export default App;