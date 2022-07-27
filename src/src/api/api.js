import account from './account'
import bill from './bill'
import preOrder from './pre-order'
import common from './common'

export default {
    ...account,
    ...bill,
    ...preOrder,
    ...common
}