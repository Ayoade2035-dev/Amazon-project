import {addToCart, cart, loadCart, loadFromStorage} from '../../data/cart.js';

describe('test suite: addToCart', () => {
  it('adds an existing product to the cart', () => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });

  it('adds a new product to the cart', () => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();

    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });

  it('loads cart data from the backend response', () => {
    const originalXMLHttpRequest = window.XMLHttpRequest;

    function FakeXMLHttpRequest() {
      this.response = JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 3,
        deliveryOptionId: '1'
      }]);
    }

    FakeXMLHttpRequest.prototype.addEventListener = function(eventName, handler) {
      if (eventName === 'load') {
        this.loadHandler = handler;
      }
    };

    FakeXMLHttpRequest.prototype.open = function() {};
    FakeXMLHttpRequest.prototype.send = function() {
      this.loadHandler();
    };

    window.XMLHttpRequest = FakeXMLHttpRequest;

    loadCart(() => {});

    expect(cart.length).toEqual(1);
    expect(cart[0].quantity).toEqual(3);

    window.XMLHttpRequest = originalXMLHttpRequest;
  });
});