const url = "https://dragonball-api.com/api/characters";

function getDragonBallZCharacters(url){
    fetch(url,{method: "GET"}).then(response => response.json()).then(data => {
        console.log('Data: ', data)
    }).catch(err => {
        console.log('Error occured:', err)
    })
}

getDragonBallZCharacters(url);