import axios from 'axios';
import authHeader from './authHeader';
import { Article, Author } from './search.service';

const API_URL = 'http://localhost:8000/graph/';

class GraphService {
  
  buildGraph(catalog_name: string, catalog_extension_name: string) {
    console.log(authHeader())
    var bodyFormData = new FormData();
    bodyFormData.append('catalog_name', catalog_name);
    bodyFormData.append('catalog_extension_name', catalog_extension_name);
    return axios.post(API_URL + 'build/', bodyFormData, { headers: authHeader() });
  }

}

export default new GraphService();