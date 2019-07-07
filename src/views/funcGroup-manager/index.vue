<script type="text/javascript" src="./index.js"></script>

<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="query">
				<el-form-item>
					<el-input v-model="query.groupCode" size="small" placeholder="功能组编码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="query.groupName" size="small" placeholder="功能组名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getFuncGroup">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="clear">清除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="danger" @click="batchDelete" size="small" :disabled="this.sels.length===0">批量删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="funcGroup" border highlight-current-row v-loading="listLoading" 
		   @selection-change="selsChange" @expand="expandChange" style="width: 100%;" height="390">
			<el-table-column type="selection" width="40"></el-table-column>
			<el-table-column type="index" width="55"></el-table-column>
			<el-table-column prop="id" label="id" v-if="false"  width="80" ></el-table-column>
			<el-table-column el-table-column type="expand">
				<template>
					<!--功能列表列表-->
					<el-table :data="appSystemFunc" highlight-current-row v-loading="listLoading" style="width: 100%;" height="200">
						<el-table-column type="index" width="55"></el-table-column>
						<el-table-column prop="id" label="id" v-if="false"  width="80" ></el-table-column>
						<el-table-column prop="funcCode" label="功能编码" width="100" ></el-table-column>
						<el-table-column prop="funcName" label="功能名称" width="100" ></el-table-column>					
						<el-table-column prop="systemName" label="所属系统" width="200"></el-table-column>
						<el-table-column label="操作"  width="200">
							<template scope="scope">
								<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</template>

			</el-table-column>
			<el-table-column prop="groupCode" label="功能组编码" width="150"></el-table-column>
			<el-table-column prop="groupName" label="功能组名称" width="250" ></el-table-column>
			<!-- <el-table-column prop="type" label="功能组类型" width="150"></el-table-column> -->
			<el-table-column prop="remark" label="备注"></el-table-column>
			<el-table-column label="操作" fixed="right" width="200">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination background
			@size-change="handleSizeChange" 
			@current-change="handleCurrentChange"  
			layout="prev, pager, next,jumper,sizes,total,slot"
			:current-page="pageNum"
			:page-sizes="[10,20,50,100]"
			:page-size="pageSize"
			:total= "total" 
			style="float:right;">
    	</el-pagination>

				<!--新增/编辑界面-->
		<el-dialog title="新增" v-model="openFormVisible" :close-on-click-modal="false">
			<el-form :model="openForm" label-width="106px" :rules="openFormRules" ref="openForm" >
				<el-input v-model="openForm.id" v-if="false" size="small"></el-input>
				<el-row >
					<el-col :span="10" >
						<el-form-item label="功能组编码：" prop="groupCode">
							<el-input v-model="openForm.groupCode" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10" >
						<el-form-item label="功能组名称：" prop="groupName">
							<el-input v-model="openForm.groupName" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row >
					<el-col :span="10" >
						<el-form-item label="备注：" prop="remark">
							<el-input v-model="openForm.remark" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="openFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="save" :loading="openLoading">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title="新增功能" v-model="openFormVisible" :close-on-click-modal="false">
			<!--列表-->
			<el-table :data="appSystemFunc" border highlight-current-row v-loading="listLoading" 
				@selection-change="selsChange" style="width: 100%;">
				<el-table-column type="selection" width="40"></el-table-column>
				<el-table-column type="index" width="55"></el-table-column>
				<el-table-column prop="id" label="id" v-if="false"  width="80" ></el-table-column>
				<el-table-column prop="funcCode" label="功能编码" width="100" ></el-table-column>
				<el-table-column prop="funcName" label="功能名称" width="100" ></el-table-column>
				<el-table-column prop="systemCode" v-if="false" label="所属系统编码" width="150"></el-table-column>
				<el-table-column prop="systemName" label="所属系统" width="150"></el-table-column>
				<el-table-column label="操作" fixed="right" width="200">
					<template scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

		</el-dialog>

		

		

	</section>
</template>



<style scoped> 	
	@import './index.less'; 
</style>
