
const USERS_PER_PAGE = 20;
export class Search {
    setCurrentPage(pageNumber) {
        this.currentPage = pageNumber;
    }
    setUsersCount(usersNumber){
        this.usersCount = usersNumber;
    }
    constructor(view, api, log){
        this.log = log;
        this.view = view;
        this.api = api;
        this.view.searchInput.addEventListener('keyup', this.debounce(this.loadUsers.bind(this), 500));
        this.view.loadMoreBtn.addEventListener('click', this.loadMoreUsers.bind(this));
        this.currentPage = 1;
        this.usersCount = 0;
    }

     loadUsers() {
        this.setCurrentPage(1);
        this.view.setCounterMessage('');
        this.usersRequest(this.view.searchInput.value);
        this.clearUsers();
        if (this.view.searchInput.value) {
        
        } else {
            this.clearUsers();
            this.view.toggleloadMoreBtn(false);
        }

    }
    loadMoreUsers(){
        this.setCurrentPage(this.currentPage + 1);
        this.usersRequest(this.view.searchInput.value);
    }
    async usersRequest(){
        let totalCount;
        let users;
        let message;
        try {
            await this.api.loadUsers(this.view.searchInput.value, this.currentPage).then((res) => {
           
                
                res.json().then((res) => {
                    users = res.items;
                    totalCount = res.total_count;
                    message = this.log.setCounterMessage(totalCount);
                    this.setUsersCount(this.usersCount + res.items.length)
                    this.view.setCounterMessage(message);
                    this.view.toggleloadMoreBtn(totalCount > USERS_PER_PAGE && this.usersCount !== totalCount);

                    users.forEach(user => this.view.createUser(user))
                })
            
        })
        } catch (error) {
            console.log('Error: ' + error);
        }
        
    }

    clearUsers () {
        this.view.usersList.innerHTML = '';
    }
    // Возвращает функцию, которая, пока она продолжает вызываться,
// не будет запускаться.
// Она будет вызвана один раз через N миллисекунд после последнего вызова.
// Если передано аргумент `immediate` (true), то она запустится сразу же при
// первом запуске функции.

 debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
        const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
  
      const callNow = immediate && !timeout;
  
      clearTimeout(timeout);
  
      timeout = setTimeout(later, wait);
  
      if (callNow) func.apply(context, args);
    };
  }
   

}