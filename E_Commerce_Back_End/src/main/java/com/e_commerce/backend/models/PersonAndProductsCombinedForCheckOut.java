package com.e_commerce.backend.models;

import java.util.Set;

public class PersonAndProductsCombinedForCheckOut {
//use same list or object name as your client side,,,,,productsForCheckOuts,,,,,person,,,,otherwise error
	private Set<ProductsForCheckOut>productsForCheckOuts;
	private Person person;
	public Person getPerson() {
		return person;
	}
	public void setPerson(Person person) {
		this.person = person;
	}
	public Set<ProductsForCheckOut> getProductsForCheckOuts() {
		return productsForCheckOuts;
	}
	public void setProductsForCheckOuts(Set<ProductsForCheckOut> productsForCheckOuts) {
		this.productsForCheckOuts = productsForCheckOuts;
	}
	
	
	
	
	
	
	
	
	
}
