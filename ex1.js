let userDataURL = "https://jsonplaceholder.typicode.com/users"

class Exercise {
    constructor() {
        this.users = [];
        this.buttons = [];
        this.template = "";
    }

    /**
     * Initialize
     * @returns {Promise<void>}
     */
    async init() {

        this.buttons = [{icnName: "", icnEmail: ""}];

        //Need to await since fetch is async (it goes and does it's thing while the program continues)
        this.users = await this.getUsers();

        // This will normalize the data (Eg. remove name prefixes.)
        this.normalizeData(this.users);

        //Select table template html as a string from templates
        this.tableTemplate = this.getTemplates();
        
        //Sort Data Alphabetically by username or anything else
        this.sortUsers(this.users, "name");

        //Bind events to buttons
        this.bindEvents(this.users);

        //Render Data
        this.render();
    }

    bindEvents(users) {
        //For bonus points add event listener to the button to re-sort asc->desc order and vice versa
        $(document).ready(function() {
            $("#btnName").on("click", function() {
                ex.sortUsers(users, "name");
            })
        })

        $(document).ready(function() {
            $("#btnEmail").on("click", function() {
                ex.sortUsers(users, "email");
            })
        })

        $("#table > tbody > tr").hover(function(event) {
            let userCard = new UserCard(event);
            userCard.init(users[$(this).index()]);
        }, function() {
            $("#userCard").remove();
        })
    }

    normalizeData(users) {
        // Normalize names by removing common prefixes.
        users.forEach(element => {
            this.prefixes = ["Mr. ", "Mrs. ", "Dr. ", "Sir "];
            this.firstWordInStr = element.name.replace(/ .*/,' ');
            if (this.prefixes.includes(this.firstWordInStr)) {
                element.name = element.name.replace(this.firstWordInStr, "");
            }
        });
    }

    render() {
        let data = { users: this.users, buttons: this.buttons};
        let tableContainer = document.getElementById("tableContainer");
        tableContainer.innerHTML = Mustache.render(this.tableTemplate, data);
        this.bindEvents(this.users)
    }

    /**
     * Get template for table
     */
    getTemplates() {
        return document.querySelector("#tableTemplate").innerHTML;
    }

    /**
     * Sort the array of users
     */
    
    // Sorts either users or email using the array.sort function. Originally I was using unicode comparison to just look at the first character, however I rea dup on a better solution that takes into account all characters (correctly orders names with first character, but different second character)
    sortUsers(users, category) {
        if (category == "name") {
            this.asc =! this.asc
            let dec = this.asc
            users.sort(function(e1, e2){
                if(dec) {
                    if(e1.name < e2.name) {return -1;}
                    if(e1.name > e2.name) {return 1;}
                    return 0;
                } else {
                    if(e1.name > e2.name) {return -1;}
                    if(e1.name < e2.name) {return 1;}
                    return 0;
                }
            });

            if(this.asc) {
                this.buttons = ({icnName: "expand_less", icnEmail: "remove"});
            } else {
                this.buttons = ({icnName: "expand_more", icnEmail: "remove"});
            }
            
        } else if (category == "email") {
            this.asc =! this.asc
            let dec = this.asc
            users.sort(function(e1, e2){
                if(dec) {
                    if(e1.email < e2.email) {return -1;}
                    if(e1.email > e2.email) {return 1;}
                    return 0;
                } else {
                    if(e1.email > e2.email) {return -1;}
                    if(e1.email < e2.email) {return 1;}
                    return 0;
                }
            });

            if(this.asc) {
                this.buttons = ({icnEmail: "expand_less", icnName: "remove"});
            } else {
                this.buttons = ({icnEmail: "expand_more", icnName: "remove"});
            }

        }

        // Rerender the the template with the data in the new order
        this.render();
    }

    /**
     * Fetch users from 'https://jsonplaceholder.typicode.com/users'
     * @returns {Promise<void>}
     */
    async getUsers() {
        let response = fetch(userDataURL).then(
            function(response) {
                if(response.status != 200){
                    console.log("There was an error retrieving the data. " + userDataURL + " Retruned with status: " + response.status);
                    return;
                } 
            console.log("Data succesfully recieved with status: " + response.status);
            return response.json();
            }
        )
        return response;
    }
}

// I decided to use MustacheJS to create a template system for user cards that are displayed when hovering over a row. Though the cards are baren right now, I could image them being filled with user content (such as bios, etc.) in a real world use case.
class UserCard {
    constructor(event) {
        this.template = "";
        this.event = event;
    }

    async init(user) {
        this.user = user
        this.userCardTemplate = this.getTemplate();
        this.render();
        this.showDiv(event);
    }

    showDiv(e) {
        let left = event.clientX + 15;
        let top = event.clientY + 15;

        let cardWidth = $("#userCard").width();
        let cardHeight = $("#userCard").height() + 50;

        if(left + cardWidth > window.innerWidth) {
            $("#userCard").css("left", left - cardWidth);
        } else {
            $("#userCard").css("left", left);
        }

        if(top + cardHeight > window.innerHeight) {
            $("#userCard").css("top", top - cardHeight);
        } else {
            $("#userCard").css("top", top);
        }
    }

    getTemplate() {
        return document.querySelector("#userCardTemplate").innerHTML;
    }

    render() {
        let data = { user: this.user};
        let userPageContainer = document.getElementById("userCardContainer");
        userPageContainer.innerHTML = Mustache.render(this.userCardTemplate, data);
    }
}

let ex = new Exercise();

ex.init();