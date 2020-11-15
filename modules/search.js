const USERS_PER_PAGE = 20;
export class Search {
    setCurrentPage(pageNumber) {
        this.currentPage = pageNumber;
    }
    constructor(view){
        this.view = view;
        this.view.searchInput.addEventListener('keyup', this.loadUsers.bind(this));
        this.view.loadMore.addEventListener('click', this.loadUsers.bind(this));
        this.currentPage = 1;
    }

    async loadUsers() {
        return await fetch(`https://api.github.com/search/users?q=${this.view.searchInput.value}&per_page=${USERS_PER_PAGE}&page=${this.currentPage}`)
        .then((res) => {
            if (res.ok) {
                this.setCurrentPage(this.currentPage + 1);
                res.json().then((res) => {
                    res.items.forEach(user => this.view.createUser(user))
                })
            } else {

            }
        })
    }
   

}