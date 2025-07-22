import axios from 'axios';
import inventoryAPI from "../../../redux/api/inventoryAPI";

const DownloadTagPrint = async (details) => {
  const tagIds = details.map(item => item.tag_id);
  if (!tagIds || tagIds.length === 0) {
    alert('Please provide tag IDs');
    return;
  }

  try {
    const response = await inventoryAPI.tag.getTagPrnFile(
      { tag_ids: tagIds },
      { responseType: "blob" } // This depends on how Auth.post is implemented
    );

    // Create blob and trigger download
    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Try to get filename from content-disposition header
    let fileName = `labels_${Date.now()}_sds.prn`;
    const contentDisposition = response.headers['content-disposition'];
    const match = contentDisposition?.match(/filename="?(.+?)"?$/);
    if (match?.[1]) fileName = match[1];

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download tag print file.');
  }
};

export default DownloadTagPrint;
