
function getEl(x){
    const el = document.querySelector(x);
    if(el){
      return el;
    }
    throw new Error(`Please check your ${x}, no such element exist`);
}
class Gallery{
    constructor(images){
        this.galleryContainer = images;
        this.imgGallery = this.galleryContainer.querySelector(".preview-img");
        this.imgs = this.imgGallery.querySelectorAll(".preview");
        this.mainImgContainer = this.galleryContainer.querySelector(".main-img");
        this.mainImg = this.mainImgContainer.querySelector(".main");
        this.nextBtn = this.galleryContainer.querySelector(".next");
        this.prevBtn = this.galleryContainer.querySelector(".prev");
        
        //event listener
        this.imgGallery.addEventListener("click", (e)=>{
            if(e.target.classList.contains("preview")){
                this.chooseImg(e.target);
            }
        });

        this.nextBtn.addEventListener("click",(e)=>{
            const selected = this.imgGallery.querySelector(".current");
            this.nextImg(selected);
        });

        this.prevBtn.addEventListener("click", (e)=>{
            const selected = this.imgGallery.querySelector(".current");
            this.prevImg(selected);
        });
    }   
    removeCurrent(){
        this.imgs.forEach(function(img){
            img.classList.remove("current");
        });
    }

    setMainImg(selectedImg){
        this.mainImg.src = selectedImg.src;
    }
        chooseImg(selectedImg){
            this.removeCurrent();
            const selected = selectedImg;
            selected.classList.add("current");
            this.setMainImg(selected);
        }

        nextImg(selectedImg){
            this.removeCurrent();
            const next = selectedImg.nextElementSibling || this.imgGallery.firstElementChild;
            next.classList.add("current");
            this.setMainImg(next);
        }

        prevImg(selectedImg){
            this.removeCurrent();
            const next = selectedImg.previousElementSibling || this.imgGallery.lastElementChild;
            next.classList.add("current");
            this.setMainImg(next);
        }
        
}
class Cart{
    constructor(el){
        this.price = 34.99;
        this.size = getEl("select");
        this.quantity = 1;
        this.cart = el;
        this.cartContainer = getEl(".items");
        this.toggle = getEl(".cart");
        this.exit = getEl(".exit");
        this.infos = getEl(".infos");
        this.addCart = this.infos.querySelector(".addCart");


        //event listener
        this.toggle.addEventListener("click", ()=>{
                this.cart.classList.add("open");
        });
        this.exit.addEventListener("click", ()=>{
            this.cart.classList.remove("open");
        });0
        // this.addCart.addEventListener("click", (e)=>{
        //     e.preventDefault();
        //     this.cart.classList.add("open");
        //     addItemToCart(this.size.value);
        //     // this.addToCart();
        // });
    }


}
class CartItem{
        constructor(basket,size){
        this.price = 34.99;
        this.size = size;
        this.quantity = 1;
        this.cart = basket;
        this.cartContainer = getEl(".items");
        }
}
// const infos = getEl(".infos");
// const addCart = infos.querySelector(".addCart");


const addCart = document.querySelector(".addCart");
const cartItemArray = [];
const mainContainer = document.querySelector(".inspect");
const previewImg = new Gallery(getEl(".img"));
const cart = new Cart(getEl(".basket"));
const cartWidth = window.outerWidth - (mainContainer.getBoundingClientRect().width + mainContainer.getBoundingClientRect().left);

const cartIcon = getEl(".basket");
const items = getEl(".items");
const size = getEl("#sizes");
const price = 34.99;
if(window.innerWidth <= 1200){
        cart.cart.style.width = `100vw`;
}
else{
    cart.cart.style.width = `${cartWidth}px`;
}

function checkItemExistence(arr, size){
    itemsExist = false;
    for(let i = 0; i < arr.length; i++){
        if(arr[i].size === size){
                itemsExist = true;          
        } 
    }
    return itemsExist;
}

function getTargetIndex(target){
    const size = target.dataset.id;
    const targetItem = cartItemArray.filter((y)=>{
                if(y.size === size){
                    return y;
                   
                }
    });
    let index = cartItemArray.indexOf(targetItem[0]);
    return index;
}
function removeItemFromCart(target){
    const index = getTargetIndex(target);
    cartItemArray.splice(index, 1);
    modifyItem(cartItemArray);
}
function addQuantity(size, target){
    const index = getTargetIndex(target);
    for(let i = 0; i < cartItemArray.length; i++){
        if(cartItemArray[i].size === size){
            if(cartItemArray[i].quantity < 10){
                cartItemArray[i].quantity++;
                cartItemArray[i].price = (price * cartItemArray[i].quantity).toFixed(2);
                }   
        }
       } 
       modifyItem(cartItemArray);
}
function subtractQuantity(size, target){
    for(let i = 0; i < cartItemArray.length; i++){
        if(cartItemArray[i].size === size){
            if(cartItemArray[i].quantity > 1){
                cartItemArray[i].quantity--;
                cartItemArray[i].price = (price * cartItemArray[i].quantity).toFixed(2);
                } 
                else if(cartItemArray[i].quantity === 1){
                    deleteLocalStorage(target);
                    cartItemArray.splice(i, 1);
                   
                }  

        }
       } 
       modifyItem(cartItemArray);
}
function saveLocalStorage(target){
    let item;
    
    if(localStorage.getItem("item") === null){
            item = [];
    }
    else{
        item = JSON.parse(localStorage.getItem("item"));
    }
    const x = getTargetIndex(target);
    let itemExist = checkItemExistence(item, cartItemArray[x].size);

    if(!itemExist || cartItemArray.length===0){
        item.push(cartItemArray[x]);
    }
    else if(itemExist && cartItemArray.length!==0){ // unfinished
        for(let i = 0; i < item.length; i++){
                if(item[i].size === cartItemArray[x].size){
                    console.log(item[i]);
                    item[i].quantity = cartItemArray[x].quantity;
                    item[i].price = cartItemArray[x].price;
                }   
        }
    }
    

localStorage.setItem("item", JSON.stringify(item));

}

function deleteLocalStorage(target){
    let item;
    
    if(localStorage.getItem("item") === null){
            item = [];
    }
    else{
        item = JSON.parse(localStorage.getItem("item"));
    }
    const index = getTargetIndex(target);
    if(item[index]){
        item.splice(index,1);
    }
    localStorage.setItem("item", JSON.stringify(item));
}


function modifyItem(arr){
    const itemArray = arr.map((x)=>{
        return `
        <div class="item" data-id="${x.size}">
        <img class ="itemImg"src="https://cdn.shopify.com/s/files/1/1571/7417/products/mikutshirtblackfront_900x.jpg?v=1637795499" alt="">
         <div class="details">
            <div class="itemInfo">
                <h5>Miku Portrait T-Shirt Black</h5>
                 <h5 class="price">$${x.price}</h5>
                <h6 class="size">${x.size}</h6>
                 <div class="amount">
                    <div class="decrement">-</div>
                    <div class="quantity">${x.quantity}</div>
                     <div class="increment">+</div>
               </div>
             </div>
             <div class="aside">
                <img class="icon like" src="../img/heart (1).png" alt="">
                 <img class="icon close"src="../img/close.png" alt="">
            </div>
         </div>
     </div>`;
});
const content = itemArray.join("");
items.innerHTML = content;  
const item = items.querySelectorAll(".item");
          item.forEach(function(article){
                article.addEventListener("click", function(e){
                    const targetSize = e.target.parentElement.previousElementSibling.textContent;
                    if(e.target.classList.contains("close")){
                        deleteLocalStorage(e.currentTarget);
                        removeItemFromCart(e.currentTarget);
                        
                    }
                    else if(e.target.classList.contains("like")){
                            saveLocalStorage(e.currentTarget);
                            e.target.classList.add("liked");
                            // e.target.style.opacity = "0.6";
                            // e.target.style.cursor= "default";
                    }
                    else if(e.target.classList.contains("increment")){
                        
                            addQuantity(targetSize, e.currentTarget);
                            modifyItem(cartItemArray);
                    }
                    else if(e.target.classList.contains("decrement")){
                            subtractQuantity(targetSize, e.currentTarget);
                            modifyItem(cartItemArray);
                    }
                });

          });

        
}
window.addEventListener("load", ()=>{
    let item;
    if(localStorage.getItem("item") === null){
            item = [];
    }
    else{
        item = JSON.parse(localStorage.getItem("item"));
        item.forEach((obj)=>{
        cartItemArray.push(obj);
        });
    }
    modifyItem(item);
});
function addItemToCart(size){
    let itemsExist = checkItemExistence(cartItemArray, size);
    console.log(itemsExist);
    const el = getEl(".basket"); 
    
    console.log(size);
     if(cartItemArray.length=== 0 || !itemsExist){
         cartItemArray.push(new CartItem(el, size));
         console.log("no items");
     }
    
     else if(itemsExist){
        for(let i = 0; i < cartItemArray.length; i++){
            if(cartItemArray[i].size === size){
                if(cartItemArray[i].quantity < 10){
                    cartItemArray[i].quantity++;
                    cartItemArray[i].price = (price * cartItemArray[i].quantity).toFixed(2);
                }   
            }
           } 
        }
     
    modifyItem(cartItemArray);
}
addCart.addEventListener("click", (e)=>{
    e.preventDefault();
   cartIcon.classList.add("open");
    addItemToCart(size.value);
});




