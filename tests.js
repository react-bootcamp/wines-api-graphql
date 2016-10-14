const { graphql } = require('graphql');
const { schema } = require('./wines');

 const query1 = `
   query WineQuery {
     wine(id: "chevrol-bel-air") {
       id
       comments {
         date
         title
         content
       }
     }
     region(id: "Champagne") {
       id
       wines(first: 3) {
         id
         name
         type
         grapes
         liked
         image {
           url
         }
         comments(last: 2) {
           date
           title
           content
         }
         appellation {
           name
           region
         }
       }
     }
   }
 `

 const query2 = `
   query RegionsQuery {
     region(id: "Bordeaux") {
       id
       wine(id: "chevrol-bel-air") {
         name
         comments {
           content
         }
       }
     }
     regions {
       id
       wines(last: 2) {
         name
         image {
           url
         }
       }
     }
   }
 `

 const query3 = `
   query WinesQuery {
     wines(first: 3) {
       name
       appellation {
         name
         region
       }
     }
   }
 `

 graphql(schema, query1).then(r => console.log('query 1 =>', prettify(r)));
 graphql(schema, query2).then(r => console.log('query 2 =>', prettify(r)));
 graphql(schema, query3).then(r => console.log('query 3 =>', prettify(r)));
