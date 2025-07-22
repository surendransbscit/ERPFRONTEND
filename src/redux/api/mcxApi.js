import { Auth } from "../configs";

const api = {
    buySell: {
        createBuySell: (content) => Auth.post("/mcx/buy_sell/create/", content),
        getAllBuySell: (page, records,search, content) => Auth.post(`/mcx/buy_sell/list/?page=${page}&records=${records}&searchText=${search}`, content),
        getOpeningPosition: () => Auth.get(`/mcx/buy_sell/get_opening_position/`),
    }
};
const mcxAPI = { ...api };

export default mcxAPI;