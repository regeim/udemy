class ElementAttribute {

    constructor(attributeName, attributeValue) {
        this.name = attributeName;
        this.value = attributeValue;
    }

}
class Component {

    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;
        if (shouldRender) {
            this.render();
        }
    }

    render() {};

    createElement(tag, cssClass, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClass) {
            rootElement.className = cssClass;
        }
        if (attributes && attributes.length > 0) {
            for (const attribute of attributes) {
                rootElement.setAttribute(attribute.name, attribute.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }

}

class Product {

    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
}

class ProductItem extends Component{

    constructor(product, renderHookId) {
        super(renderHookId, false);
        this.product = product;
        this.render();
    }
    addToCart () {
        App.addProductToCar(this.product);
    }
    render() {
        const prodEL = this.createElement('li','product-item');
        prodEL.innerHTML = `
            <div>
                <img src="${this.product.imageUrl}" alt="${this.product.title}">
                <div class="product-item__content">
                <h2>${this.product.title}</h2>
                <h3>\$${this.product.price}</h3>
                <p>${this.product.description}</p>
                <button>Add to Cart</button>
                </div>
            </div>
            `;
        const addCartButton = prodEL.querySelector('button');
        addCartButton.addEventListener('click', this.addToCart.bind(this));
    }
}

class ProductList extends Component{

    #products = [];

    constructor(renderHookId) {
        super(renderHookId, false);
        this.#fetchProducts();
    }

    #fetchProducts () {
        this.#products = [
            new Product(
                'A Pillow',
                'https://cdn.shopify.com/s/files/1/0530/0908/8663/products/pude_junior_dansk_1200x.png?v=1612526302',
                19.99,
                'A soft pillow!'
            ),
            new Product(
                'Carpet',
                'https://www.rugvista.hu/image/desk_pdp_zoom/411699.jpg',
                89.99,
                'A carpet which you might like'
            )
        ];
        this.render();
    }

    renderProducts (prodList) {
        for (const product of this.#products) {
            new ProductItem(product,prodList.id);
        }
    }

    render() {

        const prodList = this.createElement(
            'ul','product-list',
            [new ElementAttribute('id','product-list')]);

        if (this.#products && this.#products.length > 0 ) {
            this.renderProducts(prodList);
        }

    }
};

class ShoppingCart extends Component{
    items = [];

    constructor(renderHookId) {
        super(renderHookId,false);
        this.orderProduct = () => {
            console.log('Ordering...');
            console.log(this.items);
        };
        this.render();

    }

    set cartItems (value) {
        this.items = value;
        this.totalAmountOut.innerHTML = `Total: \$${this.totalAmount.toFixed(2)}`;
    }

    get totalAmount () {
        const sum = this.items.reduce((previousValue,currentValue)=>previousValue+currentValue.price,0);
        return sum;
    }

    addProduct (product){
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;

    }

    render() {
        const cartEL = this.createElement('section','cart');
        cartEL.innerHTML = `
            <h2>Total: \$${0}</h2>
            <button>Order Now!</button>
        `;
        this.totalAmountOut = cartEL.querySelector('h2');
        const orderButton = document.querySelector('button');
        orderButton.addEventListener('click',this.orderProduct);
    }
}


class Shop {
    constructor() {
        this.render();
    }
    render() {
        this.cart = new ShoppingCart('app');
        new ProductList('app');
    }
}

class App {
    static cart;

    static init () {
        const shop = new Shop();
        this.cart = shop.cart;
    }

    static addProductToCar (product) {
        this.cart.addProduct(product);
    }

}

App.init();

