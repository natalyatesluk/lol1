import { createOrder } from "../orderAPI/order.js";
import { CustomModal } from "./main.js";

const orderModalTitle = `Create order`;
const orderModalContent = `<form name="orderForm">
    <div class="mb-3 order-recipient-name">
        <label for="recipientName" class="form-label">Recipient name</label>
        <input type="text" class="form-control" id="recipientName" name="recipientName" placeholder="-- enter the recipient's full name --" required>
    </div>
    <div class="mb-3 order-delivery-region">
    <label for="deliveryRegion" class="form-label">Region</label>
    <select class="form-control" id="deliveryRegion" name="deliveryRegion" required>
        <option value="" disabled selected>-- select a region --</option>
        <option value="Cherkasy">Cherkasy</option>
        <option value="Chernihiv">Chernihiv</option>
        <option value="Chernivtsi">Chernivtsi</option>
        <option value="Dnipro">Dnipro</option>
        <option value="Donetsk">Donetsk</option>
        <option value="Ivano-Frankivsk">Ivano-Frankivsk</option>
        <option value="Kharkiv">Kharkiv</option>
        <option value="Kherson">Kherson</option>
        <option value="Khmelnytskyi">Khmelnytskyi</option>
        <option value="Kropyvnytskyi">Kropyvnytskyi</option>
        <option value="Kyiv">Kyiv</option>
        <option value="Luhansk">Luhansk</option>
        <option value="Lviv">Lviv</option>
        <option value="Mykolaiv">Mykolaiv</option>
        <option value="Odesa">Odesa</option>
        <option value="Poltava">Poltava</option>
        <option value="Rivne">Rivne</option>
        <option value="Sumy">Sumy</option>
        <option value="Ternopil">Ternopil</option>
        <option value="Transcarpathia">Transcarpathia (Uzhhorod)</option>
        <option value="Vinnytsia">Vinnytsia</option>
        <option value="Volyn">Volyn (Lutsk)</option>
        <option value="Zaporizhzhia">Zaporizhzhia</option>
        <option value="Zhytomyr">Zhytomyr</option>
    </select>
</div>
<div class="mb-3 order-delivery-remark">
<label for="deliveryRemark" class="form-label">Remark adress(optional)</label>
<textarea class="form-control" id="deliveryRemark" name="deliveryRemark" rows="3"></textarea>
</div>

<div class="mb-3 order-delivery-warehouse">
    <label for="warehouseNumber" class="form-label">Warehouse Number</label>
    <input type="number" class="form-control" id="warehouseNumber" name="warehouseNumber" placeholder="-- enter the warehouse number --" required>
</div>

    <div class="modal-form-footer">
        <input type="submit" class="btn btn-success" id="orderSubmitBtn" value="Confirm">
    </div>
</form>`  ;
const orderModalFooter =``;

export const orderModal = new CustomModal('ordr', orderModalTitle, orderModalContent, orderModalFooter);
orderModal.create();


document.forms['orderForm'].addEventListener('submit', (event) => {
    event.preventDefault();
    createOrder();
})