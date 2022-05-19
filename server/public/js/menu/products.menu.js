
import { categoryMenu, productsMenu, confirmMenu } from "./list.js";
import { request } from "../util/axios.js"
import { playInteract, playVoices } from "../sound/sound.js"


productsMenu.init = async () => {
    let category = productsMenu.prev_data
    productsMenu.title = `Sản phẩm trong ${category}`
    productsMenu.datas = await request("post", "/api/category/list", { category })
    productsMenu.block_data = productsMenu.dataToString()
    for (var i = 0; i < productsMenu.datas.length; i++) {
        productsMenu.voice_data.push([{
            id: `product${i + 1}`,
            text: `sản phẩm ${i + 1}`
        }, {
            id: `product_${productsMenu.datas[i]._id}`,
            text: productsMenu.datas[i].voiceline
        }])
    }
    productsMenu.voice_init = {
        id: `product_init_${category}`,
        text: `dưới đây là danh sách sản phẩm trong danh mục ${category}`
    }
}

productsMenu.on_select = async (index) => {
    let product = productsMenu.datas[index]
    confirmMenu.start(product)
}

productsMenu.on_return = async () => {
    categoryMenu.back()
}

productsMenu.on_voice = async (voice) => {
    let text = voice.text
    let num = voice.num
    if (text.includes("quay lại")) {
        // Return
        playInteract()
        categoryMenu.back()
    } else if (text.includes("chọn")) {
        // Choose product
        let index = parseInt(num, 10)
        if (text.includes("đầu") || text.includes("nhất")) {
            index = 1
        } else if (text.includes("cuối")) {
            index = productsMenu.datas.length
        }
        if (index != NaN) {
            if (index > 0 && index <= productsMenu.datas.length) {
                playInteract()
                let product = productsMenu.datas[index - 1]
                confirmMenu.start(product)
            }
        }
    }
}


export { productsMenu }
