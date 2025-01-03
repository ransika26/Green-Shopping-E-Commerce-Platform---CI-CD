import CustomerAuthenticationModel from "../models/Customer_authentication_platform.js";

// Socket.IO instance
let io;

// Socket.IO setter and getter
export const setSocketIO = (socketIOInstance) => {
    io = socketIOInstance;
};

export const getSocketIO = () => io;

// Get customer by ID
export const getCustomeraccountbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const customeraccount = await CustomerAuthenticationModel.findById(id);

        if (!customeraccount) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customeraccount);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving account data", error });
    }
};

// Update customer by ID
export const updateCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedCustomer = await CustomerAuthenticationModel.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Emit socket event when customer is updated
        if (io) {
            io.emit("customerUpdated", updatedCustomer);
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error updating account data", error });
    }
};

// Delete customer by ID
export const deleteCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCustomer = await CustomerAuthenticationModel.findByIdAndDelete(
            id
        );

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Emit socket event when customer is deleted
        if (io) {
            io.emit("customerDeleted", id);
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting account", error });
    }
};
