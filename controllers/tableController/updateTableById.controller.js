import { updateTableByIdService } from "../../services/updateTableById.service.js";

export const updateTableById = async (req, res) => {
  try {
    const { tableId } = req.params;
    const tableUpdated = await updateTableByIdService(tableId, req.body);
    if (tableUpdated === `No changes to update`) {
      return res.status(400).json({
        message: tableUpdated,
        success: false,
      });
    }
    if (
      tableUpdated ===
      `Can not update table with id ${tableId} due to table not found`
    ) {
      return res.status(404).json({
        message: tableUpdated,
        success: false,
      });
    }
    return res.status(200).json({
      message: `Update table ${tableId} successfully`,
      data: tableUpdated,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error`,
      error: error.message,
    });
  }
};
