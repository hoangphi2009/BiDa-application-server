import { updateTableByIdService } from "../../services/updateTableById.service.js";

export const updateTableById = async (req, res) => {
  try {
    const { tableId } = req.params;
    const tableUpdated = await updateTableByIdService(tableId, req.body);

    return res.status(200).json({
      message: `Update table ${tableId} successfully`,
      data: tableUpdated,
    });
  } catch (error) {
    const { tableId } = req.params;
    if (
      error.message ===
      `Can not update table with id ${tableId} due to table not found`
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
