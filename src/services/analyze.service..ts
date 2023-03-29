
import axios from 'axios';
import authHeader from './authHeader';
import { Article } from './search.service';

const API_URL = 'http://18.185.240.197:8000/analyze/';

class AnalyzeService {

    getCentrality(node_type:string, edge_type:string, metric: string, catalog_base_name:string, catalog_extension_name:string){
        return axios.get(API_URL + 'centrality/'+metric+'/?node_type='+node_type+'&edge_type='+edge_type+'&catalog_base_name='+catalog_base_name+'&catalog_extension_name='+catalog_extension_name, { headers: authHeader() })
    }

}

export default new AnalyzeService();