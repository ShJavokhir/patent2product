# Command
#  python crawl_patent2.py https://patents.google.com/patent/US20120281344A1/en?oq=20120281344
import requests
from bs4 import BeautifulSoup
import json
import os
import sys
import re
import pypdfium2 as pdfium
from urllib.parse import urljoin, urlparse


###############################################################################
# Helpers
###############################################################################


def safe_mkdir(path):
    os.makedirs(path, exist_ok=True)
    return path


def extract_patent_id_from_url(url):
    """
    Extract something like 'US10362384B2' from:
    https://patents.google.com/patent/US10362384B2/en
    """
    m = re.search(r"/patent/([A-Za-z0-9]+)", url)
    if m:
        return m.group(1)
    return "patent"


def download_file(url, dest_folder, filename=None):
    safe_mkdir(dest_folder)

    if not filename:
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path) or "file"

    dest_path = os.path.join(dest_folder, filename)

    # If file already exists, do NOT download again
    if os.path.exists(dest_path):
        return dest_path

    r = requests.get(url, stream=True)
    r.raise_for_status()

    with open(dest_path, "wb") as f:
        for chunk in r.iter_content(8192):
            if chunk:
                f.write(chunk)

    return dest_path


def extract_title(soup):
    tag = soup.find("span", class_="patent-title")
    if tag:
        return tag.get_text(strip=True)

    meta = soup.find("meta", {"name": "DC.title"})
    if meta and meta.get("content"):
        return meta["content"].strip()

    if soup.title:
        return soup.title.get_text(strip=True)

    return None


def extract_pdf_url(soup, page_url):
    a = soup.find("a", string=lambda s: s and "pdf" in s.lower())
    if a and a.get("href"):
        return urljoin(page_url, a["href"])

    for a in soup.find_all("a", href=True):
        if ".pdf" in a["href"].lower():
            return urljoin(page_url, a["href"])

    for a in soup.find_all("a", href=True):
        if "patentimages.storage.googleapis.com" in a["href"] and ".pdf" in a["href"].lower():
            return a["href"]

    return None


def extract_abstract(soup):
    meta = soup.find("meta", {"name": "DC.description"})
    if meta and meta.get("content"):
        return meta["content"].strip()

    div = soup.find("div", class_=lambda c: c and "abstract" in c.lower())
    if div:
        return div.get_text(strip=True)

    return None


def extract_images_from_pdf(pdf_path, output_dir):
    safe_mkdir(output_dir)
    images = []

    pdf = pdfium.PdfDocument(pdf_path)
    n_pages = len(pdf)

    for i in range(n_pages):
        page = pdf[i]
        bitmap = page.render(scale=2.0)
        pil_image = bitmap.to_pil()

        filename = f"page_{i+1}.png"
        local_path = os.path.join(output_dir, filename)

        # Skip if already exists
        if not os.path.exists(local_path):
            pil_image.save(local_path)

        images.append(local_path)

    return images


def load_manifest(path):
    if not os.path.exists(path):
        return []
    try:
        with open(path, "r") as f:
            return json.load(f)
    except:
        return []


def save_manifest(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


###############################################################################
# Main crawler
###############################################################################


def crawl_patent(url, base_dir="downloads"):
    # Create base
    safe_mkdir(base_dir)

    patent_id = extract_patent_id_from_url(url)
    patent_dir = safe_mkdir(os.path.join(base_dir, patent_id))

    # Fetch HTML
    r = requests.get(url)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    title = extract_title(soup)
    abstract = extract_abstract(soup)
    pdf_url = extract_pdf_url(soup, url)

    # Prepare result record
    result = {
        "page_url": url,
        "patent_id": patent_id,
        "title": title,
        "abstract": abstract,
        "pdf_url": pdf_url,
        "pdf_local_path": None,
        "images_from_pdf": []
    }

    # PDF download
    if pdf_url:
        pdf_local_path = download_file(
            pdf_url,
            os.path.join(patent_dir, "pdf"),
            "patent.pdf"
        )
        result["pdf_local_path"] = pdf_local_path

        # Extract high-res images from the PDF
        images = extract_images_from_pdf(
            pdf_local_path,
            os.path.join(patent_dir, "pdf_images")
        )
        result["images_from_pdf"] = images

    return result


###############################################################################
# Script entry
###############################################################################

if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else \
        "https://patents.google.com/patent/US10362384B2/en"

    base_dir = "downloads"
    manifest_path = os.path.join(base_dir, "manifest.json")

    # Load existing manifest (list)
    manifest = load_manifest(manifest_path)

    # Crawl
    entry = crawl_patent(url, base_dir=base_dir)

    # Add entry to manifest (no duplicates)
    # (Use patent_id as key)
    if not any(e["patent_id"] == entry["patent_id"] for e in manifest):
        manifest.append(entry)

    # Save manifest
    save_manifest(manifest_path, manifest)

    # Print result to console too
    print(json.dumps(entry, indent=2, ensure_ascii=False))
