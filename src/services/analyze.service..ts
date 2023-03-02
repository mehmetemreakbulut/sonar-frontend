
import axios from 'axios';
import authHeader from './authHeader';
import { Article } from './search.service';

const API_URL = 'http://localhost:8000/analyze/';

class AnalyzeService {

    getCentrality(node_type:string, edge_type:string, metric: string){
        return axios.get(API_URL + 'centrality/'+metric+'/?node_type='+node_type+'&edge_type='+edge_type, { headers: authHeader() })
    }

}

export default new AnalyzeService();