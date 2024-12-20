const supabase = require("../config/supabaseClient");

// Delete a Hauberg by id (with cascade)
exports.delete = async (req, res) => {
  const { id } = req.params; // Extract the 'id' from the URL path parameter

  // Validate that the id is a number (basic check)
  if (!id || isNaN(id)) {
    return res.status(400).send({
      message: "'id' is required and must be a valid number."
    });
  }

  try {
    // First, check if the Hauberg exists with the provided id
    const { data: existingHauberg, error: fetchError } = await supabase
      .from("hauberg")
      .select("*")
      .eq("id", id); // Match only by id

    if (fetchError) {
      console.error("Error fetching data:", fetchError.message);
      return res.status(500).send({
        message: fetchError.message || "Error occurred while fetching Hauberg."
      });
    }

    // If no Hauberg is found with the specified id, respond with a 404
    if (existingHauberg.length === 0) {
      return res.status(404).send({
        message: "Hauberg not found with the provided id."
      });
    }

    // Proceed to delete the Hauberg based on the provided id
    const { data, error: deleteError } = await supabase
      .from("hauberg")
      .delete()
      .match({ id }); // Match by id only

    if (deleteError) {
      console.error("Error deleting data:", deleteError.message);
      return res.status(500).send({
        message: deleteError.message || "Error occurred while deleting Hauberg."
      });
    }

    // Successfully deleted the Hauberg, cascade will take care of related records
    res.status(200).send({
      message: "Hauberg deleted successfully!",
      data: data // Send back the deleted data
    });

  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).send({
      message: error.message || "Some error occurred while deleting the Hauberg."
    });
  }
};
