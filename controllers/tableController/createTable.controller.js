import { createTableService } from '../../services/createTable.service.js'

export const createTable = async (req, res) => {
  try {
    const tableData = req.body;
    // eslint-disable-next-line new-cap
    const newTable = await createTableService(tableData);

    return res.status(200).json({
      message: 'Successfully created table',
      table: newTable
    });
  } catch (error) {
    const { tableId } = req.body;
    console.log(error)
    if (error.message === `Table with ID ${tableId} already exists`) {
      return res.status(400).json({
        message: error.message
      });
    }
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}
