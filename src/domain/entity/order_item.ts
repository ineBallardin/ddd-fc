/**
 * Ajuste no price do OrderItem
Olá Devs,

Para a aula "Relacionando Item com Product", foi necessário corrigir o método get price do OrderItem, pois, multiplicando o price com a quantidade estava gerando inconsistência em alguns testes.

Deste modo, o price ficou assim:

  get price(): number {
    return this._price;
  }

E criamos o método  orderItemTotal, que ficou assim:

  orderItemTotal(): number {
    return this._price * this._quantity;
  }

 E pra relacionar com a classe Order, a função total passa a ficar da seguinte maneira:

  total(): number {
    return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
  }

Deste modo, os preços unitário são retornados com sucesso. 
 */

export default class OrderItem {
  private _id: string;
  private _productId: string;
  private _name: string;
  private _price: number;
  private _quantity: number;
  private _total: number;

  constructor(
    id: string,
    name: string,
    price: number,
    productId: string,
    quantity: number
  ) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._productId = productId;
    this._quantity = quantity;
    this._total = this.orderItemTotal();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price;
  }

  orderItemTotal(): number {
    return this._price * this._quantity;
  }

  validate():boolean{
    if(this._quantity === 0){
        throw new Error("Quantity must be greater than 0");
    }
    return true;
}
}