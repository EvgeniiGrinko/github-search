export class View {
    constructor(api){
        this.app = document.querySelector('#app');
        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'Github Search Users';
        this.api = api; 

        this.searchLine = this.createElement('div', 'search-line');
        this.searchInput = this.createElement('input', 'search-input');
        this.searchCounter = this.createElement('span', 'counter');
        this.searchLine.append(this.searchInput);
        this.searchLine.append(this.searchCounter);

       

        this.main = this.createElement('div', 'main');
        this.usersWrapper = this.createElement('div', 'users-wrapper');
        
        this.usersList = this.createElement('ul', 'users');
        this.userWrapper = this.createElement('div', 'user-info');
        
        this.usersWrapper.append(this.usersList);
     
        
        this.loadMoreBtn = this.createElement('button', 'btn');
        this.loadMoreBtn.textContent = 'Загрузить еще';
        this.loadMoreBtn.style.display = 'none';

        this.usersWrapper.append(this.loadMoreBtn);

        this.main.append(this.usersWrapper)
        this.main.append(this.userWrapper)
        this.app.append(this.title);
        this.app.append(this.searchLine);
      
        this.app.append(this.main);

    }
    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }
    createUser(userData) {
        const userElement = this.createElement('li', 'user-prev');
        userElement.addEventListener('click', () => this.showUserData(userData));
        userElement.innerHTML = `<img class="user-prev-photo" src="${userData.avatar_url}" "alt="${userData.login}">
        <span class="user-prev-name">${userData.login}</span>`;
        this.usersList.append(userElement);

    }
    showUserData(userData) {
        const userEl = this.createElement('div', 'user');
        this.userWrapper.innerHTML = '';
        this.api.loadUserData(userData.login).then(res => {
            const [following, followers, repos] = res;
            const followingList = this.createDataList(following, 'Following');
            const followersList = this.createDataList(followers, 'Followers');
            const reposList = this.createDataList(repos, 'Repos');
        
            userEl.innerHTML = `<img src="${userData.avatar_url}" "alt="${userData.login}">
                                <h2>${userData.login}</h2>
                                ${followingList}
                                ${followersList}
                                ${reposList}`;

        })
       
        this.userWrapper.append(userEl);
    }
    createDataList(list, title) {
        const block = this.createElement('div', 'user-block');
        const titleTag = this.createElement('h3', 'user-block-title');
        const listTag = this.createElement('ul', 'user-list');
        titleTag.textContent = title;
        list.forEach(item => {
            const el = this.createElement('li', 'user-list-item');
            el.innerHTML = `<a href="${item.html_url}">${item.login ? item.login : item.name}</a>`

            listTag.append(el)
        })
        block.append(titleTag);
        block.append(listTag);
        return block.innerHTML;
    }
    toggleloadMoreBtn(show) {
        this.loadMoreBtn.style.display = show ? 'block' : 'none';
    }
    setCounterMessage(message) {
        this.searchCounter.textContent = message;
    }
}


