// SPDX-License-Identifier: JAIRO LAMUS
pragma solidity ^0.7.5;

contract Hola{
    
    //DECLARACION DE VARIABLES DEL CONTRATO
    string v_contrato_saludo;
    
    
    //FUNCIONES SET
    function set_saludo ( string memory v_parametro_saludo) public {
        v_contrato_saludo = v_parametro_saludo;
    }
    
    
    //FUNCIONES GET
    function get_saludo () public view returns (string memory) {
        return v_contrato_saludo;
    }  
    
    
    
    
}