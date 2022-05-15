const API_KEY = 'aec33696be6649b7adca9116c819246d';
const element = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');
const title = document.querySelector('.title');
const declOfNum = (n, titles) => titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const choices = new Choices(element, {
    searchEnabled: false,
    itemSelectText: '',
});

const getData = async (url) => {
    const response = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY,
        }
    }); 

    const data = await response.json();
    return data;
};

const getDateCorrectFormat = (isoDate) => {

    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const fullTime = date.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    });
    return `<span class="news-date">${fullDate}</span> ${fullTime}`
}
 
const getImage = url => new Promise((resolve, reject) => {
    const image = new Image(270, 200);

    image.addEventListener('load', () => {
        resolve(image)
    });

    image.addEventListener('error', () => {
        image.src = 'assets/img/no-photo.svg';
        resolve(image);
    });

    image.src = url || 'assets/img/no-photo.svg';
    image.className ='news-image';

    return image;
});

const renderCard = (data) => {
    newsList.textContent ='';


    data.forEach( async news => {

        const { urlToImage, title, url, description, publishedAt, author } = news;
        const card = document.createElement('li');
        card.className = 'news-item';

        const image = await getImage(urlToImage);
        image.alt = title;
        card.append(image);


        card.insertAdjacentHTML('beforeend',  `
        
        <h3 class="news-title">
            <a href="${ url }" class="news-link" target="_blank">${ title || '' }</a>
        </h3>

        <p class="news-description">${ description || '' }</p>

        <div class="news-footer">
            <time class="news-datetime" datetime="${ publishedAt }">
                ${ getDateCorrectFormat(publishedAt) }
            </time>
            <div class="news-author">${ author || news.source.name || ''}</div>
        </div>
        
        `);

        newsList.append(card);
    })

}

const loadNews = async () => {
    newsList.innerHTML = '<li class="preload"></li>';
    const  country = localStorage.getItem('country') || 'ru';
    choices.setChoiceByValue(country);
    title.classList.add('hide');

    const data = await getData(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=32`);
    renderCard(data.articles);
};


const loadSearch = async (value)  => {
    
    const data = await getData(`https://newsapi.org/v2/everything?q=${value}`);
    title.classList.remove('hide');
    const arrStr1 = ['найден', 'найдено', 'найдено'];
    const arrStr2 = ['результат', 'результата', 'результатов'];
    const count = data.articles.length; 
    title.textContent = `По вашему запросу "${value}" найдено ${declOfNum(count, arrStr1)} ${count} ${declOfNum(count, arrStr2)}`;
    choices.setChoiceByValue('');
    renderCard(data.articles);
}

element.addEventListener('change', (event) => {
    const value = event.detail.value;
    localStorage.setItem('country', value);
    loadNews(value);
});

formSearch.addEventListener('submit', event => {
    event.preventDefault();
    loadSearch(formSearch.search.value);
    formSearch.reset();
});

loadNews();

