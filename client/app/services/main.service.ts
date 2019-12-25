import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'client/environments/environment';

@Injectable()
export class MainService {

  API_URL = 'http://felix.' + environment.API_URL;

  constructor(private httpc: HttpClient, private router: Router) {
  }

  getGlobalSettings() {
    return this.httpc.get(this.API_URL + '/init')
  }

  // Buckets

  createBucket(bucket) {
    return this.httpc.post(this.API_URL + '/bucket/', bucket);
  }

  getAllBuckets() {
    return this.httpc.get(this.API_URL + '/bucket/');
  }

  updateBucket(bucket) {
    return this.httpc.put(this.API_URL + '/bucket/', bucket);
  }

  getBucket(bucketName) {
    return this.httpc.get(this.API_URL + '/bucket/' + bucketName);
  }

  deleteBucket(bucketName) {
    return this.httpc.delete(this.API_URL + '/bucket/' + bucketName);
  }

  // Objects

  searchObjects(filters) {
    return this.httpc.post(this.API_URL + '/bucket/objects/', filters);
  }

  deleteObjects(data) {
    return this.httpc.post(this.API_URL + '/bucket/objects/delete', data);
  }

  uploadObjects(path, file) {
    return this.httpc.put(this.API_URL + '/bucket/objects/' + path, file);
  }

  shareObject(data) {
    return this.httpc.put(this.API_URL + '/bucket/objects/share', data);
  }

  updateObjectPermission(data) {
    return this.httpc.put(this.API_URL + '/bucket/objects/filepermissions', data);
  }

  updateObjectMeta(data) {
    return this.httpc.put(this.API_URL + '/bucket/objects/meta', data);
  }

  // New Folder

  createFolder(data) {
    return this.httpc.post(this.API_URL + '/bucket/objects/folder', data);
  }

  // Move Object

  moveObjects(data) {
    return this.httpc.put(this.API_URL + '/bucket/objects/move', data);
  }

  // GET All Directories

  getAllDirectories(bucketName) {
    return this.httpc.get(this.API_URL + '/bucket/objects/directories/' + bucketName);
  }

}
